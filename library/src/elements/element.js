class Element {
  constructor() {}
  hasInputs() {}
  hasOutPuts() {}
  getAssetInputs() {} //can zero, have many, or all
  getAssetOutputs() {}
  canConnectOutput(outputIndex, operation) {}
  connectOutput(outputIndex, operation) {}
  disconnectOutput(outputIndex, operation) {}
}

module.exports = Element;
