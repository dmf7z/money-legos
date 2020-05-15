const helper = require("../utils/helper");

class Graph {
  constructor() {
    this.elements = [];
  }
  //GETTERS
  getElementById(id) {
    return this.elements.find((element) => element.id == id);
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
      parent.connections[parentOutputIndex] = [element.id];
    }
    this.elements.push(element);
    return element.id;
  }
}

module.exports = Graph;
