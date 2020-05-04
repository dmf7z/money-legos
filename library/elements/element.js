class Operation extends Element {
  constructor() {}
  hasInputs() {}
  hasOutPuts() {}
  getAssetInputs() {} //can zero, have many, or all
  getAssetOutputs() {}
  canConnectOutput(output, operation) {}
  connectOutput(output, operation) {}
  disconnectOutput(output, operation) {}
}
