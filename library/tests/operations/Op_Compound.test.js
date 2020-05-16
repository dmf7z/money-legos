const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");
const Web3 = require("web3");
const BN = require("bn.js");
const ABICoder = require("web3-eth-abi");
const Deployer = require("../deploy/deployer");
const ExecutorABI = require("../abi/executor");
const ERC20ABI = require("../abi/erc20");

chai.use(chaiAsPromised);
const expect = chai.expect;

var web3 = new Web3(process.env.PROVIDER || "ws://localhost:8545");

describe("Operation Compound", function() {
  let contracts;
  before(async function() {
    contracts = await Deployer.deploy();
  });

  it("Lend and Redeem ETH", async function() {
    const accounts = await web3.eth.getAccounts();

    const executorContract = new web3.eth.Contract(
      ExecutorABI,
      contracts.OPERATION_EXECUTOR
    );
    const cethContract = new web3.eth.Contract(ERC20ABI, contracts.ASSETS.CETH);

    await web3.eth.sendTransaction({
      from: accounts[0],
      to: contracts.OPERATION_EXECUTOR,
      value: "2000000000000000000",
    });

    let ethBalance = await web3.eth.getBalance(contracts.OPERATION_EXECUTOR);
    expect(ethBalance.toString(10)).to.equal("2000000000000000000");

    let cethBalance = await cethContract.methods
      .balanceOf(contracts.OPERATION_EXECUTOR)
      .call();
    expect(cethBalance.toString(10)).to.equal("0");

    //Lend
    let params = ABICoder.encodeParameters(
      ["address", "address", "bool"],
      [contracts.ASSETS.CETH, contracts.ASSETS.ETH, true]
    );
    await executorContract.methods
      .executeOperation(
        contracts.OPERATIONS.OP_COMPOUND,
        ["1000000000000000000"],
        params
      )
      .send({
        from: accounts[0],
        gas: 1500000,
      });

    ethBalance = await web3.eth.getBalance(contracts.OPERATION_EXECUTOR);
    expect(ethBalance.toString(10)).to.equal("1000000000000000000");

    cethBalance = await cethContract.methods
      .balanceOf(contracts.OPERATION_EXECUTOR)
      .call();
    expect(new BN(cethBalance).gt(new BN(1))).to.equal(true);

    //Redeem
    params = ABICoder.encodeParameters(
      ["address", "address", "bool"],
      [contracts.ASSETS.CETH, contracts.ASSETS.ETH, false]
    );
    await executorContract.methods
      .executeOperation(contracts.OPERATIONS.OP_COMPOUND, [cethBalance], params)
      .send({
        from: accounts[0],
        gas: 1500000,
      });

    cethBalance = await cethContract.methods
      .balanceOf(contracts.OPERATION_EXECUTOR)
      .call();
    expect(cethBalance.toString(10)).to.equal("0");
  });
});
