const helper = require("../utils/helper");
const Element = require("./element");

class Operation extends Element {
  constructor(operationAddress, inAssets, outAssets) {
    super(inAssets, outAssets);
    this.operationAddress = operationAddress;
  }
}

module.exports = Operation;
