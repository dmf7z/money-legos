const config = require("../../../../common/contracts");
const Element = require("./element");

class Input extends Element {
  constructor(assetAddress) {
    super(config.OPERATIONS.INPUT, [], [assetAddress]);
  }
}

module.exports = Input;
