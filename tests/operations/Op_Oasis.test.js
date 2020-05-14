const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");
const Web3 = require("web3");
const BN = require("bn.js");
const ABICoder = require("web3-eth-abi");
const Deployer = require("../deploy/deployer");
const OpOasisABI = require("../abi/oasis_matching_market");
const ExecutorABI = require("../abi/executor");
const ERC20ABI = require("../abi/erc20");

chai.use(chaiAsPromised);
const expect = chai.expect;

var web3 = new Web3(process.env.PROVIDER || "ws://localhost:8545");

describe("Operation Oasis", function() {
  let contracts;
  before(async function() {
    contracts = await Deployer.deploy();
  });

  it("Trade ETH for DAI", async function() {
    const accounts = await web3.eth.getAccounts();

    const executorContract = new web3.eth.Contract(
      ExecutorABI,
      contracts.OPERATION_EXECUTOR
    );
    const oasisContract = new web3.eth.Contract(
      OpOasisABI,
      contracts.OASIS.OASIS_MATCHING_MARKET
    );
    const daiContract = new web3.eth.Contract(ERC20ABI, contracts.ASSETS.DAI);
    const wethContract = new web3.eth.Contract(ERC20ABI, contracts.ASSETS.WETH);

    await web3.eth.sendTransaction({
      from: accounts[0],
      to: contracts.OPERATION_EXECUTOR,
      value: "2000000000000000000",
    });

    let ethBalance = await web3.eth.getBalance(contracts.OPERATION_EXECUTOR);
    expect(ethBalance.toString(10)).to.equal("2000000000000000000");

    let wethBalance = await wethContract.methods
      .balanceOf(contracts.OPERATION_EXECUTOR)
      .call();
    expect(wethBalance.toString(10)).to.equal("0");

    //Wrap
    let params = ABICoder.encodeParameter("bool", true);
    await executorContract.methods
      .executeOperation(
        contracts.OPERATIONS.OP_WRAP_ETH,
        ["1000000000000000000"],
        params
      )
      .send({
        from: accounts[0],
      });

    wethBalance = await wethContract.methods
      .balanceOf(contracts.OPERATION_EXECUTOR)
      .call();
    expect(wethBalance.toString(10)).to.equal("1000000000000000000");

    let daiBalance = await daiContract.methods
      .balanceOf(contracts.OPERATION_EXECUTOR)
      .call();
    expect(daiBalance.toString(10)).to.equal("0");

    const offerId = await oasisContract.methods
      .getBestOffer(contracts.ASSETS.DAI, contracts.ASSETS.WETH)
      .call();

    //const result = await oasisContract.methods.getOffer(offerId).call();
    //console.log(result);

    //Trade in Uniswap WETH for DAI
    params = ABICoder.encodeParameter("uint256", offerId);
    await executorContract.methods
      .executeOperation(
        contracts.OPERATIONS.OP_OASIS,
        ["1000000000000000000"],
        params
      )
      .send({
        from: accounts[0],
        gas: 1500000,
      });

    wethBalance = await wethContract.methods
      .balanceOf(contracts.OPERATION_EXECUTOR)
      .call();
    expect(wethBalance.toString(10)).to.equal("0");

    daiBalance = await daiContract.methods
      .balanceOf(contracts.OPERATION_EXECUTOR)
      .call();
    expect(new BN(daiBalance).gt(new BN(1))).to.equal(true);
  });
});
