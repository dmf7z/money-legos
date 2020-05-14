const Element = require("./element");

class Address extends Element {
  constructor(address) {
    super(address, ["all"], []);
  }
}

module.exports = Address;
