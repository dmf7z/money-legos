const helper = require("../utils/helper");
const Element = require("./element");

class Input extends Element {
  constructor(assetAddress) {
    super([], [assetAddress]);
  }
}

module.exports = Input;
