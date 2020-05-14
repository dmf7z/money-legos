const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");
const Web3 = require("web3");
const ABICoder = require("web3-eth-abi");
const Deployer = require("../deploy/deployer");
const ExecutorABI = require("../abi/executor");
const ERC20ABI = require("../abi/erc20");

chai.use(chaiAsPromised);
const expect = chai.expect;

var web3 = new Web3(process.env.PROVIDER || "ws://localhost:8545");

describe("Operation Wrap", function() {
  let contracts;
  before(async function() {
    contracts = await Deployer.deploy();
  });

  it("Wrap and Unwrap ETH", async function() {
    const accounts = await web3.eth.getAccounts();

    const executorContract = new web3.eth.Contract(
      ExecutorABI,
      contracts.OPERATION_EXECUTOR
    );
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

    ethBalance = await web3.eth.getBalance(contracts.OPERATION_EXECUTOR);
    expect(ethBalance.toString(10)).to.equal("1000000000000000000");

    wethBalance = await wethContract.methods
      .balanceOf(contracts.OPERATION_EXECUTOR)
      .call();
    expect(wethBalance.toString(10)).to.equal("1000000000000000000");

    //Unwrap
    params = ABICoder.encodeParameter("bool", false);
    await executorContract.methods
      .executeOperation(
        contracts.OPERATIONS.OP_WRAP_ETH,
        ["1000000000000000000"],
        params
      )
      .send({
        from: accounts[0],
      });

    ethBalance = await web3.eth.getBalance(contracts.OPERATION_EXECUTOR);
    expect(ethBalance.toString(10)).to.equal("2000000000000000000");

    wethBalance = await wethContract.methods
      .balanceOf(contracts.OPERATION_EXECUTOR)
      .call();
    expect(wethBalance.toString(10)).to.equal("0");
  });
});
