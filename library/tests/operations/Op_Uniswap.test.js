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

describe("Operation Uniswap", function() {
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

    //Trade in Uniswap  ETH for DAI
    const secondsToToday = new Date().getTime() / 1000;
    deadline = Math.floor(secondsToToday + 300); // 5 minutes from now
    let params = ABICoder.encodeParameters(
      ["address", "address", "bool", "uint256", "uint256"],
      [
        contracts.UNISWAP.UNISWAP_EXCHANGE_DAI_ETH,
        contracts.ASSETS.DAI,
        false,
        "1",
        deadline,
      ]
    );
    await executorContract.methods
      .executeOperation(
        contracts.OPERATIONS.OP_UNISWAP,
        ["1000000000000000000"],
        params
      )
      .send({
        from: accounts[0],
        gas: 1500000,
      });

    ethBalance = await web3.eth.getBalance(contracts.OPERATION_EXECUTOR);
    expect(ethBalance.toString(10)).to.equal("1000000000000000000");

    daiBalance = await daiContract.methods
      .balanceOf(contracts.OPERATION_EXECUTOR)
      .call();
    expect(new BN(daiBalance).gt(new BN(1))).to.equal(true);
  });
});
