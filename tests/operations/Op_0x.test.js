const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");
const Web3 = require("web3");
const BN = require("bn.js");
const ABICoder = require("web3-eth-abi");
const Deployer = require("../deploy/deployer");
const ExecutorABI = require("../abi/executor");
const Op0xABI = require("../abi/op_0x");
const ERC20ABI = require("../abi/erc20");
const MeshClient = require("@0x/mesh-rpc-client");

chai.use(chaiAsPromised);
const expect = chai.expect;

var web3 = new Web3(process.env.PROVIDER || "ws://localhost:8545");

const addPrefix = (asset) => {
  return `0xf47261b0000000000000000000000000${asset
    .substring(2)
    .toLowerCase()}`;
};

const isPair = (order, asset1, asset2) => {
  return (
    order.signedOrder.makerAssetData === addPrefix(asset1) &&
    order.signedOrder.takerAssetData === addPrefix(asset2)
  );
};

const getOrder = (contracts) => {
  const client = new MeshClient.WSClient("ws://192.168.1.12:60557");
  return new Promise((resolve, reject) => {
    client.subscribeToOrdersAsync(function(orders) {
      for (let index = 0; index < orders.length; index++) {
        const order = orders[index];
        if (
          isPair(order, contracts.ASSETS.DAI, contracts.ASSETS.WETH) &&
          order.fillableTakerAssetAmount.gt(new BN("1000000000000000"))
        ) {
          return resolve(order);
        }
      }
    });
  });
};

describe("Operation 0x", function() {
  let contracts;
  let order;
  before(async function() {
    contracts = await Deployer.deploy();
    order = await getOrder(contracts);
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
      makerAddress: order.signedOrder.makerAddress,
      takerAddress: order.signedOrder.takerAddress,
      feeRecipientAddress: order.signedOrder.feeRecipientAddress,
      senderAddress: order.signedOrder.senderAddress,
      makerAssetAmount: order.signedOrder.makerAssetAmount.toString(10),
      takerAssetAmount: order.signedOrder.takerAssetAmount.toString(10),
      makerFee: order.signedOrder.makerFee.toString(10),
      takerFee: order.signedOrder.takerFee.toString(10),
      expirationTimeSeconds: order.signedOrder.expirationTimeSeconds.toString(
        10
      ),
      salt: order.signedOrder.salt.toString(10),
      makerAssetData: order.signedOrder.makerAssetData,
      takerAssetData: order.signedOrder.takerAssetData,
      makerFeeAssetData: order.signedOrder.makerFeeAssetData,
      takerFeeAssetData: order.signedOrder.takerFeeAssetData,
    };

    //Trade
    const paramsOp1 = ABICoder.encodeParameter("bool", true);
    const paramsOp2 = await op0xContract.methods
      .encodeParams(
        orderParam,
        order.signedOrder.signature,
        contracts.ASSETS.WETH
      )
      .call();

    const result = await op0xContract.methods
      .isValidOrderSignature(paramsOp2)
      .call();
    expect(result).to.equal(true);

    const amount = order.fillableTakerAssetAmount.gt(
      new BN("1000000000000000000")
    )
      ? "1000000000000000000"
      : order.fillableTakerAssetAmount.toString(10);

    await executorContract.methods
      .executeOperations([
        {
          addr: contracts.OPERATIONS.OP_WRAP_ETH, //ETH To WETH
          inAmounts: [amount],
          params: paramsOp1,
        },
        {
          addr: contracts.OPERATIONS.OP_0X, //WETH To DAI
          inAmounts: [amount],
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
