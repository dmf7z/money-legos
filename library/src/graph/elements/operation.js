const Element = require("./element");

class Operation extends Element {
  constructor(operationAddress, inAssets, outAssets) {
    super(operationAddress, inAssets, outAssets);
  }
}

module.exports = Operation;
