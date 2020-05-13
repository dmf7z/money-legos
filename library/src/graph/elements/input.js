const config = require("../../config");
const Element = require("./element");

class Input extends Element {
  constructor(assetAddress) {
    super(config.OPERATIONS.INPUT, [], [assetAddress]);
  }
}

module.exports = Input;
