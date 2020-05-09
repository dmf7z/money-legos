const Element = require("./element");

class Address extends Element {
  constructor(address) {
    super(["all"], []);
    this.address = address;
  }
}

module.exports = Address;
