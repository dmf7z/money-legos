const ABICoder = require("web3-eth-abi");
const BN = require("bn.js");
const ERC20ABI = require("../abi/erc20");
const GraphData = require("../abi/Graph.json");
const shortHash = require("short-hash");
const Elements = require("../elements");
const Op0xABI = require("../abi/op_0x");

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
        if (data.data === null) {
          return "Value is null";
        }
        //TODO
      }
      case "timestamp": {
        if (data.data === null) {
          return "Value is null";
        }
        //TODO
      }
      case "address": {
        if (data.data === null) {
          return "Value is null";
        }
        //TODO
      }
      case "0xOrder": {
        if (data.data === null) {
          return "Value is null";
        }
        //TODO
      }
      case "0xSignature": {
        if (data.data === null) {
          return "Value is null";
        }
        //TODO
      }
    }
  }
  return "ok";
};

class Graph {
  constructor(address, elements, contracts) {
    this.nextElementId = 0;
    this.address = address;
    this.elements = elements;
    this.contracts = contracts;
    this.allElements = Elements(contracts);
  }
  getElementById(id) {
    return this.elements.find((element) => element.id == id);
  }
  getElementIndexById(id) {
    return this.elements.findIndex((element) => element.id == id);
  }
  canBeRootElement(element) {
    return element.inputs.length == 0;
  }
  setExecutionData(elementId, paramIndex, value) {
    const element = this.getElementById(elementId);
    if (element.executionData.length > paramIndex) {
      element.executionData[paramIndex].data = value;
    } else throw "Invalid param index";
  }
  async isElementReadyToExecute(web3, elementId) {
    const element = this.getElementById(elementId);
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
        if (new BN(value).gt(new BN(0))) {
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
    }
    return "ready";
  }
  async isReadyToExecute(web3) {
    //TODO: Validate if it has flashuniswapIn then it must have out
    for (const element of this.elements) {
      const result = await this.isElementReadyToExecute(web3, element.id);
      if (result !== "ready") {
        return false;
      }
    }
    return true;
  }
  canConnectOutput(parent, parentOutputIndex, element, elementInputIndex) {
    if (
      parent.outputs[parentOutputIndex] == element.inputs[elementInputIndex]
    ) {
      return true;
    }
    return false;
  }
  async allowInputElement(web3, elementId) {
    const element = this.getElementById(elementId);
    if (element.executionData[0].data != ETHER) {
      const [account] = await web3.eth.getAccounts();
      const erc20Contract = new web3.eth.Contract(
        ERC20ABI,
        element.executionData[0].data
      );
      await erc20Contract.methods
        .approve(this.address, element.executionData[1].data)
        .send({
          from: account,
          gas: 1000000,
        });
    }
  }
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
    for (const key in this.allElements) {
      const element = this.allElements[key];
      if (
        assets.every((input) => element.inputs.includes(input)) &&
        (!element.exactInputMatch || element.inputs.length == assets.length)
      ) {
        availableElements.push(element);
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
            : data.dataType == "timestamp"
            ? "uint256"
            : data.dataType
        );
        dataList.push(data.data);
      }
      console.log(typesList, dataList);
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
    console.log(elements);
    //Deploy contract
    const [account] = await web3.eth.getAccounts();
    const graphContract = new web3.eth.Contract(GraphData.abi);
    const graphInstance = await graphContract
      .deploy({
        data: GraphData.bytecode,
        arguments: [elements],
      })
      .send({
        from: account,
        gas: 4000000,
      });
    this.address = graphInstance.options.address;
    return this.address;
  }
  async execute(web3) {
    if (this.isReadyToExecute(web3)) {
      let maxElementInputs = 0;
      let ethValue = new BN(0);
      const allParams = [];
      for (const element of this.elements) {
        maxElementInputs = Math.max(maxElementInputs, element.inputs.length);
        if (
          element.type == "InputElement" &&
          element.executionData[0].data == ETHER
        ) {
          ethValue = ethValue.add(new BN(element.executionData[1].data));
        }
        if (element.key.startsWith("OP_0x")) {
          const op0xContract = new web3.eth.Contract(
            Op0xABI,
            this.contracts.OPERATIONS.OP_0X
          );
          const order = element.executionData[0].data;
          const orderParam = {
            makerAddress: order.signedOrder.makerAddress,
            takerAddress: order.signedOrder.takerAddress,
            feeRecipientAddress: order.signedOrder.feeRecipientAddress,
            senderAddress: order.signedOrder.senderAddress,
            makerAssetAmount: order.signedOrder.makerAssetAmount.toString(10),
            takerAssetAmount: order.signedOrder.takerAssetAmount.toString(10),
            makerFee: order.signedOrder.makerFee.toString(10),
            takerFee: order.signedOrder.takerFee.toString(10),
            expirationTimeSeconds: order.signedOrder.expirationTimeSeconds.toString(
              10
            ),
            salt: order.signedOrder.salt.toString(10),
            makerAssetData: order.signedOrder.makerAssetData,
            takerAssetData: order.signedOrder.takerAssetData,
            makerFeeAssetData: order.signedOrder.makerFeeAssetData,
            takerFeeAssetData: order.signedOrder.takerFeeAssetData,
          };
          const params = await op0xContract.methods
            .encodeParams(
              orderParam,
              order.signedOrder.signature,
              element.executionData[1].data
            )
            .call();
          allParams.push(params);
        } else {
          const typesList = [];
          const dataList = [];
          for (const data of element.executionData) {
            typesList.push(
              data.dataType == "0xOrder"
                ? "bytes"
                : data.dataType == "timestamp"
                ? "uint256"
                : data.dataType
            );
            dataList.push(data.data);
          }
          console.log(typesList, dataList);
          allParams.push(ABICoder.encodeParameters(typesList, dataList));
        }
      }

      //Deploy contract
      const [account] = await web3.eth.getAccounts();
      const graphContract = new web3.eth.Contract(GraphData.abi, this.address);
      const result = await graphContract.methods
        .execute(allParams, maxElementInputs)
        .send({
          from: account,
          gas: 4000000,
          value: ethValue,
        });

      return result.transactionHash;
    } else {
      throw "Not ready to execute";
    }
  }
}

module.exports = Graph;
