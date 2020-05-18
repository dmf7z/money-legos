const ABICoder = require("web3-eth-abi");
const BN = require("bn.js");
const helper = require("../utils/helper");
const ERC20ABI = require("../abi/erc20");
const GraphData = require("../../build/contracts/Graph.json");
const AllElements = require("../elements");
const shortHash = require("short-hash");

const ETHER = "0x0000000000000000000000000000000000000000";

const addCreationData = (element, creationData) => {
  for (const data of creationData) {
    element.executionData[data.index].data = data.value;
    const result = validateElementData(element.executionData[data.index]);
    if (result !== "ok") {
      throw result;
    }
  }
};

const validateElementData = (data) => {
  if (data.type === "input") {
    switch (data.dataType) {
      case "uint256": {
        const bn = new BN(data.data, 10);
        if (data.min) {
          if (bn.lt(new BN(data.min))) {
            return `${data.title} has to be greater than ${data.min}`;
          }
        }
        if (data.max) {
          if (bn.gt(new BN(data.max))) {
            return `${data.title} has to be lower than ${data.max}`;
          }
        }
      }
      case "uint8": {
        //TODO
      }
      case "timestamp": {
        //TODO
      }
      case "address": {
        //TODO
      }
      case "0xOrder": {
        //TODO
      }
      case "0xSignature": {
        //TODO
      }
    }
  }
  return "ok";
};

class Graph {
  constructor(address, elements) {
    this.nextElementId = 0;
    this.address = address;
    this.elements = elements;
  }
  //GETTERS
  getElementById(id) {
    return this.elements.find((element) => element.id == id);
  }
  getElementIndexById(id) {
    return this.elements.findIndex((element) => element.id == id);
  }
  //VALIDATIONS
  canBeRootElement(element) {
    return element.inputs.length == 0;
  }
  async isElementReadyToExecute(web3, element) {
    if (!this.address) {
      return "Graph has not been deployed yet";
    }
    for (const data of element.executionData) {
      const result = validateElementData(data);
      if (result !== "ok") {
        return result;
      }
      if (
        element.type == "InputElement" &&
        element.executionData[0].data != ETHER
      ) {
        //Check enough allowance
        const value = element.executionData[1].data;
        const [account] = await web3.eth.getAccounts();
        const erc20Contract = new web3.eth.Contract(
          ERC20ABI,
          element.executionData[0].data
        );
        const allowedBalance = await erc20Contract.methods
          .allowance(account, this.address)
          .call();
        if (new BN(value).gt(new BN(allowedBalance))) {
          return "Not enough allowance for the input value";
        }
      }
    }
    return "ready";
  }
  async isReadyToExecute(web3) {
    for (const element of this.elements) {
      const result = await this.isElementReadyToExecute(web3, element);
      if (result !== "ready") {
        return {
          elementId: element.id,
          error: result,
        };
      }
    }
    return "ready";
  }
  canConnectOutput(parent, parentOutputIndex, element, elementInputIndex) {
    if (
      parent.outputs[parentOutputIndex] == element.inputs[elementInputIndex]
    ) {
      return true;
    }
    return false;
  }
  //ADDITION, CONNECTION, REMOVAL
  addElement(coreElement, x, y, creationData = []) {
    const element = JSON.parse(JSON.stringify(coreElement));
    if (this.canBeRootElement(element)) {
      addCreationData(element, creationData);
      element.index = [x, y];
      element.id = this.nextElementId;
      this.nextElementId++;
      this.elements.push(element);
      return element.id;
    }
    throw "Cannot add a root element that receives assets";
  }
  // setExecutionData(element, paramIndex, data) {
  //   if()
  // }
  connectElements(parentItems, coreElement, x, y, creationData = []) {
    const element = JSON.parse(JSON.stringify(coreElement));
    addCreationData(element, creationData);
    element.index = [x, y];
    element.id = this.nextElementId;
    this.nextElementId++;
    //Check connections
    for (const parentItem of parentItems) {
      const parentId = parentItem[0];
      const parentOutputIndex = parentItem[1];
      const elementInputIndex = parentItem[2];
      const parent = this.getElementById(parentId);
      if (
        !this.canConnectOutput(
          parent,
          parentOutputIndex,
          element,
          elementInputIndex
        )
      ) {
        throw "Cannot connect elements";
      }
    }
    //Connect
    for (const parentItem of parentItems) {
      const parentId = parentItem[0];
      const parentOutputIndex = parentItem[1];
      const elementInputIndex = parentItem[2];
      const parent = this.getElementById(parentId);
      parent.connections[parentOutputIndex] = {
        id: element.id,
        index: elementInputIndex,
      };
    }
    this.elements.push(element);
    return element.id;
  }
  getAvailableElements(parentIds) {
    var assetsSet = new Set();
    for (const id of parentIds) {
      const parent = this.getElementById(id);
      for (const asset of parent.outputs) {
        assetsSet.add(asset);
      }
    }
    const assets = Array.from(assetsSet);
    const availableElements = [];
    for (const key in AllElements) {
      const element = AllElements[key];
      for (const input of element.inputs) {
        if (assets.indexOf(input) >= 0) {
          availableElements.push(element);
          break;
        }
      }
    }
    return availableElements;
  }
  async deploy(web3) {
    //Prepare elements
    const elements = this.elements.map((element) => {
      const typesList = [];
      const dataList = [];
      for (const data of element.executionData) {
        typesList.push(
          data.dataType == "0xOrder"
            ? "bytes"
            : data.dataType == "0xSignature"
            ? "bytes"
            : data.dataType == "timestamp"
            ? "uint256"
            : data.dataType
        );
        dataList.push(data.data);
      }
      const params = ABICoder.encodeParameters(typesList, dataList);
      const outputsIndexes = [];
      const outputsInputIndexes = [];
      for (const connection of element.connections) {
        outputsIndexes.push(this.getElementIndexById(connection.id));
        outputsInputIndexes.push(connection.index);
      }
      return {
        hash: shortHash(element.key),
        addr: element.address,
        params,
        outputsIndexes,
        outputsInputIndexes,
        x: element.index[0],
        y: element.index[1],
      };
    });
    //Deploy contract
    const [admin] = await web3.eth.getAccounts();
    const graphContract = new web3.eth.Contract(GraphData.abi);
    const graphInstance = await graphContract
      .deploy({
        data: GraphData.bytecode,
        arguments: [elements],
      })
      .send({
        from: admin,
        gas: 4000000,
      });
    this.address = graphInstance.options.address;
    return this.address;
  }
  async execute() {
    if (this.isReadyToExecute() == "ready") {
    }
    //TODO: ETH  needs to execute in value
  }
}

module.exports = Graph;
