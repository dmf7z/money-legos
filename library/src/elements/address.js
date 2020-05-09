const Element = require("./element");

class Address extends Element {
  constructor(address) {
    super([address], []);
    this.address = address;
  }
}

module.exports = Address;
