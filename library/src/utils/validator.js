const BN = require("bn.js");
const ethUtil = require("ethereumjs-util");

module.exports = {
  notNullAmount: (value) => {
    if (value) {
      const bn = new BN(value, 10);
      if (bn.gt(0)) {
        //TODO: check that is lower than max uint256
        return true;
      }
    }
    return false;
  },
  nullOrAmount: (value) => {
    if (value) {
      const bn = new BN(value, 10);
      if (bn.gt(0)) {
        //TODO: check that is lower than max uint256
        return true;
      }
      return false;
    } else {
      return true;
    }
  },
  nullOrTimeStamp: (value) => {
    if (value) {
      if (isNaN(value)) {
        return false;
      }
      const timestamp = parseInt(value);
      const secondsToToday = new Date().getTime() / 1000;
      deadline = Math.floor(secondsToToday); // 5 minutes from now
      if (timestamp > deadline) {
        return true;
      }
      return false;
    } else {
      return true;
    }
  },
  nullOrPercentage: (value) => {
    if (value) {
      if (isNaN(value)) {
        return false;
      } else {
        const percentage = parseFloat(value);
        if (percentage > 0 && percentage < 100) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return true;
    }
  },
  address: (value) => {
    return ethUtil.isValidAddress(value);
  },
};
