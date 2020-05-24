const ABICoder = require("web3-eth-abi");
const shortHash = require("short-hash");
const Graph = require("./graph/graph");
const Elements = require("./elements");
const GraphABI = require("./abi/Graph.json").abi;
const mainnetContracts = require("./common/contracts");
const OrderHelper = require("./utils/orderHelper");

const findElementByHash = (elements, hash) => {
  for (key in elements) {
    if (shortHash(key) === hash) {
      return elements[key];
    }
  }
};

const getIndexOfParentsOutput = (coreElements, indexChild, inputIndexChild) => {
  const parents = [];
  for (let index = 0; index < coreElements.length; index++) {
    const coreElement = coreElements[index];
    for (let index2 = 0; index2 < coreElement.outputsIndexes.length; index2++) {
      if (
        parseInt(coreElement.outputsIndexes[index2]) === parseInt(indexChild) &&
        parseInt(coreElement.outputsInputIndexes[index2]) ===
          parseInt(inputIndexChild)
      ) {
        parents.push({
          index: index,
          ouputIndex: index2,
        });
      }
    }
  }
  return parents;
};

module.exports = {
  helper: OrderHelper,
  getElements: (contracts = mainnetContracts) => {
    return Elements(contracts);
  },
  createGraph: (contracts = mainnetContracts) => {
    return new Graph(null, [], contracts);
  },
  loadGraph: async (web3, address, contracts = mainnetContracts) => {
    const elements = Elements(contracts);
    const graphContract = new web3.eth.Contract(GraphABI, address);
    const coreElements = await graphContract.methods.getElements().call();

    //Create graph
    const graph = new Graph(address, [], contracts);

    //Decode coreElements params
    for (let index = 0; index < coreElements.length; index++) {
      const coreElement = coreElements[index];
      const element = findElementByHash(elements, coreElement.hash);
      const typesList = [];
      const inputIndexes = [];
      for (let i = 0; i < element.executionData.length; i++) {
        const data = element.executionData[i];
        typesList.push(
          data.dataType == "0xOrder"
            ? "bytes"
            : data.dataType == "OasisOrder"
            ? "uint256"
            : data.dataType == "timestamp"
            ? "uint256"
            : data.dataType
        );
        if (data.dataType != "raw") {
          inputIndexes.push(i);
        }
      }
      coreElements.params = ABICoder.decodeParameters(
        typesList,
        coreElement.params
      );

      if (element.inputs.length == 0) {
        graph.addElement(
          element,
          parseInt(coreElement.x),
          parseInt(coreElement.y),
          inputIndexes.map((inputIndex) => {
            return {
              index: inputIndex,
              value: coreElements.params[inputIndex],
            };
          })
        );
      } else {
        let parents = [];
        for (let i = 0; i < element.inputs.length; i++) {
          const parentInfo = getIndexOfParentsOutput(coreElements, index, i);
          if (parentInfo.length > 0) {
            parents = parents.concat(
              parentInfo.map((parentInfo) => {
                return [
                  graph.elements[parentInfo.index].id,
                  parentInfo.ouputIndex,
                  i,
                ];
              })
            );
          }
        }
        //connect element
        graph.connectElements(
          parents,
          element,
          parseInt(coreElement.x),
          parseInt(coreElement.y),
          inputIndexes.map((inputIndex) => {
            return {
              index: inputIndex,
              value: coreElements.params[inputIndex],
            };
          })
        );
      }
    }
    return graph;
  },
};
