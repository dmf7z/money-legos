const ABICoder = require("web3-eth-abi");
const BN = require("bn.js");
const helper = require("../utils/helper");
const ERC20ABI = require("../abi/erc20");
const GraphData = require("../../build/contracts/Graph.json");
const AllElements = require("../elements");

const ETHER = "0x0000000000000000000000000000000000000000";

class Graph {
  constructor() {
    this.address = null;
    this.elements = [];
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
      console.log(data);
      if (data.type === "input") {
        switch(data.dataType) {
          case "uint256": {

          }
          case "uint8": {
            
          }
          case "timestamp": {
            
          }
          case "address": {

          }
          case "0xOrder": {

          }
          case "0xSignature": {
           // return `${dara.title} not valid`;
            
          }
        }
      }
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
  addElement(coreElement, x, y) {
    const element = JSON.parse(JSON.stringify(coreElement));
    if (this.canBeRootElement(element)) {
      element.id = helper.uuidv4();
      element.index = [x, y];
      this.elements.push(element);
      return element.id;
    }
    throw "Cannot add a root element that receives assets";
  }
  // setExecutionData(element, paramIndex, data) {
  //   if()
  // }
  connectElements(parentItems, coreElement, elementInputIndex, x, y) {
    const element = JSON.parse(JSON.stringify(coreElement));
    element.id = helper.uuidv4();
    element.index = [x, y];
    //Check connections
    for (const parentItem of parentItems) {
      const parentId = parentItem[0];
      const parentOutputIndex = parentItem[1];
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
      const elementOutputsIndexes = [];
      const elementOuputsOutIndexes = [];
      for (const connection of element.connections) {
        elementOutputsIndexes.push(this.getElementIndexById(connection.id));
        elementOuputsOutIndexes.push(connection.index);
      }
      return {
        addr: element.address,
        params,
        elementOutputsIndexes,
        elementOuputsOutIndexes,
      };
    });
    console.log(JSON.stringify(elements));
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
        gas: 3500000,
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
