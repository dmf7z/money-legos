const helper = require("../utils/helper");
const GraphData = require("../../build/contracts/Graph.json");

class Graph {
  constructor() {
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
  isElementReadyToCreate(element) {
    /*for (let index = 0; index < element.creationData.length; index++) {
      const data = element.creationData[index];
      if (!data.isValid(data.value)) return false;
    }*/
    return true;
  }
  isReadyToCreate() {
    //Check all elements are isElementReadyToCreate
    //Check it has at least one in and one out
  }
  isElementReadyToExecute(element) {
    //TODO: if element is input check allowance!!!
    //TODO: execpt if ETH, then it needs to execute in value
    /*for (const data of element.executionData) {
      if (!data.isValid(data.value)) return false;
    }*/
    return true;
  }
  isReadyToExecute() {
    //Check all elements are isElementReadyToExecute
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
    if (
      this.canBeRootElement(element) &&
      this.isElementReadyToCreate(element)
    ) {
      element.id = helper.uuidv4();
      element.index = [x, y];
      this.elements.push(element);
      return element.id;
    }
    throw "Cannot add a root element that receives assets";
  }
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
  async deploy(web3) {
    //Prepare elements
    const elements = this.elements.map((element) => {
      const params = element.executionData.map((element) => element.data);
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
    console.log(JSON.stringify(elements))
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
        gas: 2500000,
      });
    return graphInstance.options.address;
  }
}

module.exports = Graph;
