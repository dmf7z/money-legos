const fetch = require("node-fetch");
const OpOasisABI = require("../abi/oasis_matching_market");
const contracts = require("../common/contracts");

const addPrefix = (asset) => {
  return `0xf47261b0000000000000000000000000${asset
    .substring(2)
    .toLowerCase()}`;
};

const getOrder = async (index, asset1, asset2) => {
  const makerAssetData = addPrefix(asset1);
  const takerAssetData = addPrefix(asset2);

  const response = await fetch(
    `https://api.0x.org/sra/v3/orders?makerAssetData=${makerAssetData}&takerAssetData=${takerAssetData}`
  );
  const orders = await response.json();
  return orders.records[index];
};

const getNotExpiringOrder = async (asset1, asset2) => {
  let order;
  let index = 0;
  let time = new Date().getTime() / 1000 + 60; //+ 1 min
  while (
    !order ||
    parseInt(order.order.expirationTimeSeconds) < time ||
    order.order.takerFee != "0"
  ) {
    order = await getOrder(index, asset1, asset2);
    index++;
  }
  return order;
};

const getOasisOrder = async (web3, asset1, asset2) => {
  const oasisContract = new web3.eth.Contract(
    OpOasisABI,
    contracts.OASIS.OASIS_MATCHING_MARKET
  );
  const offerId = await oasisContract.methods
    .getBestOffer(asset2, asset1)
    .call();
  return offerId;
};

module.exports = {
  get0xOrder: getNotExpiringOrder,
  getOasisOrder: getOasisOrder,
};
