const Graph = require("./graph");
const InputElement = require("./elements/input");
const OperationElement = require("./elements/operation");
const Addresslement = require("./elements/address");
const SplitterElement = require("./elements/splitter");

const operationABI = require("./abi/operation");

module.exports = {
  createInputElement: (assetAddress) => {
    return new InputElement(assetAddress);
  },
  createOperationElement: async (web3, operationAddress, params) => {
    const operationContract = new web3.eth.Contract(
      operationABI,
      operationAddress
    );
    const inAssets = await operationContract.methods.getInAssets(params).call();
    const outAssets = await operationContract.methods
      .getOutAssets(params)
      .call();
    return new OperationElement(operationAddress, inAssets, outAssets);
  },
  createAddressElement: (address) => {
    return new Addresslement(address);
  },
  createSplitterElement: (percentage) => {
    if (percentage >= 0 && percentage <= 1) {
      return new SplitterElement(percentage, 1 - percentage);
    }
    throw "Invalid percentage value";
  },
  createGraph: () => {
    return new Graph();
  },
  loadGraph: (address) => {},
};
