const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");
const Web3 = require("web3");
const BN = require("bn.js");
const fetch = require("node-fetch");
const ABICoder = require("web3-eth-abi");
const Deployer = require("../deploy/deployer");
const ExecutorABI = require("../abi/executor");
const Op0xABI = require("../abi/op_0x");
const ERC20ABI = require("../abi/erc20");

chai.use(chaiAsPromised);
const expect = chai.expect;

var web3 = new Web3(process.env.PROVIDER || "ws://localhost:8545");

const addPrefix = (asset) => {
  return `0xf47261b0000000000000000000000000${asset
    .substring(2)
    .toLowerCase()}`;
};

const getOrder = async (asset1, asset2) => {
  const makerAssetData = addPrefix(asset1);
  const takerAssetData = addPrefix(asset2);
  const response = await fetch(
    `https://api.0x.org/sra/v3/orders?makerAssetData=${makerAssetData}&takerAssetData=${takerAssetData}`
  );
  const orders = await response.json();
  return orders.records[4]; //Not the first one to avoid frontrun
};

describe("Operation 0x", function() {
  let contracts;
  let order;
  before(async function() {
    contracts = await Deployer.deploy();
    order = await getOrder(contracts.ASSETS.DAI, contracts.ASSETS.WETH);
  });

  it("trade 0x order", async function() {
    const accounts = await web3.eth.getAccounts();

    const executorContract = new web3.eth.Contract(
      ExecutorABI,
      contracts.OPERATION_EXECUTOR
    );
    const op0xContract = new web3.eth.Contract(
      Op0xABI,
      contracts.OPERATIONS.OP_0X
    );
    const wethContract = new web3.eth.Contract(ERC20ABI, contracts.ASSETS.WETH);
    const daiContract = new web3.eth.Contract(ERC20ABI, contracts.ASSETS.DAI);

    await web3.eth.sendTransaction({
      from: accounts[0],
      to: contracts.OPERATION_EXECUTOR,
      value: "2000000000000000000",
    });

    let ethBalance = await web3.eth.getBalance(contracts.OPERATION_EXECUTOR);
    expect(ethBalance.toString(10)).to.equal("2000000000000000000");

    let daiBalance = await daiContract.methods
      .balanceOf(contracts.OPERATION_EXECUTOR)
      .call();
    expect(daiBalance.toString(10)).to.equal("0");

    const orderParam = {
      makerAddress: order.order.makerAddress,
      takerAddress: order.order.takerAddress,
      feeRecipientAddress: order.order.feeRecipientAddress,
      senderAddress: order.order.senderAddress,
      makerAssetAmount: order.order.makerAssetAmount.toString(10),
      takerAssetAmount: order.order.takerAssetAmount.toString(10),
      makerFee: order.order.makerFee.toString(10),
      takerFee: order.order.takerFee.toString(10),
      expirationTimeSeconds: order.order.expirationTimeSeconds.toString(10),
      salt: order.order.salt.toString(10),
      makerAssetData: order.order.makerAssetData,
      takerAssetData: order.order.takerAssetData,
      makerFeeAssetData: order.order.makerFeeAssetData,
      takerFeeAssetData: order.order.takerFeeAssetData,
    };

    //Trade
    const paramsOp1 = ABICoder.encodeParameter("bool", true);
    const paramsOp2 = await op0xContract.methods
      .encodeParams(orderParam, order.order.signature, contracts.ASSETS.WETH)
      .call();

    const result = await op0xContract.methods
      .isValidOrderSignature(paramsOp2)
      .call();
    expect(result).to.equal(true);

    const amount = new BN(order.metaData.remainingFillableTakerAssetAmount).gt(
      new BN("1000000000000000000")
    )
      ? "1000000000000000000"
      : order.metaData.remainingFillableTakerAssetAmount;

    console.log(`Amount to trade in 0x= ${amount}`)

    const fee0x = (await web3.eth.getGasPrice()) * 150000;

    await executorContract.methods
      .executeOperations([
        {
          addr: contracts.OPERATIONS.OP_WRAP_ETH, //ETH To WETH
          inAmounts: [amount],
          params: paramsOp1,
        },
        {
          addr: contracts.OPERATIONS.OP_0X, //WETH To DAI
          inAmounts: [amount, fee0x],
          params: paramsOp2,
        },
      ])
      .send({
        from: accounts[0],
        gas: 1500000,
        value: 0,
      });

    //Check WETH balance
    const wethBalance = await wethContract.methods
      .balanceOf(contracts.OPERATION_EXECUTOR)
      .call();
    expect(wethBalance.toString(10))
      .to.equal("0")
      .toString(10);

    //Check DAI balance
    const expectedDAI = new BN(amount)
      .mul(new BN(orderParam.makerAssetAmount))
      .div(new BN(orderParam.takerAssetAmount));
    daiBalance = await daiContract.methods
      .balanceOf(contracts.OPERATION_EXECUTOR)
      .call();
    expect(daiBalance.toString(10)).to.equal(expectedDAI.toString(10));
  });
});
