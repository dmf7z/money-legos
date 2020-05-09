const helper = require("../utils/helper");

class Element {
  constructor(inputs, outputs) {
    this.id = helper.uuidv4();
    this.inputs = inputs; //can zero, have many, or all
    this.outputs = outputs;
    this.connections = [];
  }
  hasInput(assetAddress) {
    return this.inputs.indexOf(assetAddress) >= 0;
  }
  hasInputs() {
    return this.inputs.length > 0;
  }
  hasOutPuts(assetAddress) {
    return this.outputs.indexOf(assetAddress) >= 0;
  }
  hasOutPuts() {
    return this.outputs.length > 0;
  }
  getInput(index) {
    return this.inputs[index];
  }
  getInputs() {
    return this.inputs;
  }
  getOutput(index) {
    return this.outputs[index];
  }
  getOutputs() {
    return this.outputs;
  }
  getConnection(index) {
    return this.connections[index];
  }
  getConnections() {
    return this.connections;
  }
  canConnectOutput(index, toElement, toIndex) {
    const addrOut = this.getOutput(index);
    const addrIn = toElement.getInput(toIndex);
    const connection = this.getConnection(index);

    if (addrOut && addrIn && (addrIn == "all" || addrOut == addrIn) && !connection) {
      return true;
    }
    return false;
  }
  connectOutput(index, toElement, toIndex) {
    if (this.canConnectOutput(index, toElement, toIndex)) {
      this.connections[index] = {
        element: toElement,
        index: toIndex,
        assetAddress: toElement.getInput(toIndex)
      };
      return true;
    }
    throw "Cannot connect elements";
  }
  disconnectOutput(index) {
    this.connections[index] = null;
  }
}

module.exports = Element;
