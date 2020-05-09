const factoryABI = require("./abi/factory");
const config = require("../config");

module.exports = {
  createMetaOperation: () => {
    const operationContract = new web3.eth.Contract(
      factoryABI,
      config.FACTORY
    )

    /*const inAssets = await operationContract.methods.getInAssets(params).call();
    const outAssets = await operationContract.methods
      .getOutAssets(params)
      .call();
    return new OperationElement(operationAddress, inAssets, outAssets);*/
  },
};
