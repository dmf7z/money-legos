const Element = require("./element");

class Splitter extends Element {
  constructor(percentage1, percentage2) {
    super(["all"], ["all", "all"]);
    this.percentage1 = percentage1;
    this.percentage2 = percentage2;
  }

  canConnectOutput(index, toElement, toIndex) {
    if (index !== 0 && index !== 1) {
      return false;
    }
    const connection1 = this.getConnection(0);
    const connection2 = this.getConnection(1);
    const addrIn = toElement.getInput(toIndex);
    if (!addrIn) {
      return false;
    }
    if (!connection1 && !connection2) {
      return true;
    } else if (
      !connection1 &&
      index == 0 &&
      (addrIn == "all" || connection2.assetAddress == addrIn)
    ) {
      return true;
    } else if (
      !connection2 &&
      index == 1 &&
      (addrIn == "all" || connection1.assetAddress == addrIn)
    ) {
      return true;
    }
    return false;
  }
  setAsset(assetAddress) {}
}

module.exports = Splitter;
