const config = require("./config");
const Graph = require("./graph/graph");
const InputElement = require("./graph/elements/input");
const OperationElement = require("./graph/elements/operation");
const AddressElement = require("./graph/elements/address");
const SplitterElement = require("./graph/elements/splitter");
const operationABI = require("./abi/operation");
const factoryABI = require("./abi/factory");
const ABICoder = require("web3-eth-abi");

const processOutputs = (connections) => {
  const outs = [];
  for (const connection of connections) {
    outs.push({
      asset: connection.assetAddress,
      amount: "1000000000000000000", //100%
      isPercentage: true,
      to: connection.element.address,
    });
  }
  return outs;
};

const processElement = (element) => {
  switch (element.constructor) {
    case InputElement: {
      const operation = {
        addr: element.address,
        inAmounts: [],
        outs: processOutputs(element.getConnections()),
        params: "",
      };
      return operation;
    }
    case OperationElement: {
      const operation = {
        addr: element.address,
        inAmounts: [],
        outs: processOutputs(element.getConnections()),
        params: "",
      };
      return operation;
    }
    case AddressElement: {
      const operation = {
        addr: element.address,
        inAmounts: [],
        outs: [],
        params: "",
      };
      return operation;
    }
    case SplitterElement: {
      const operation = {
        addr: element.address,
        inAmounts: [],
        outs: processOutputs(element.getConnections()),
        params: ABICoder.encodeParameter("uint256", element.percentage),
      };
      return operation;
    }
    default:
      throw "Invalid element";
  }
};

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
    return new AddressElement(address);
  },
  createSplitterElement: (web3, percentage) => {
    if (percentage >= 0 && percentage <= 1) {
      return new SplitterElement(web3.utils.toWei(percentage.toString()).toString(10));
    }
    throw "Invalid percentage value";
  },
  createGraph: () => {
    return new Graph();
  },
  deployGraph: (web3, graph) => {
    const operationContract = new web3.eth.Contract(factoryABI, config.FACTORY);

    /* struct Out {
        address asset;
        uint256 amount;
        bool isPercentage;
        address payable to;
    }

    struct Operation {
        address addr;
        uint256[] inAmounts;
        Out[] outs;
        bytes params;
    }*/

    const operations = [];
    for (const element of graph.elements) {
      operations.push(processElement(element));
    }
    console.log(JSON.stringify(operations));

    const metaOperationAddress = "aaaaaaaaa";

    // const receipt = await operationContract.methods.deploy(operations).send();
    // console.log(receipt);

    return metaOperationAddress;
  },
  loadGraph: (address) => {},
};
