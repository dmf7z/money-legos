const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");
const Web3 = require("web3");
const BN = require("bn.js");
var md5 = require("md5");
const factory = require("../src");
const Elements = require("../src/elements");
const Deployer = require("./deploy/deployer");
const ERC20ABI = require("./abi/erc20");

chai.use(chaiAsPromised);
const expect = chai.expect;

var web3 = new Web3(process.env.PROVIDER || "ws://localhost:8545");

describe("Uniswap Graph", function() {
  let contracts;
  let elements;
  before(async function() {
    contracts = await Deployer.deploy();
    elements = Elements(contracts);
  });
  it("Uniswap Graph", async function() {
    const daiContract = new web3.eth.Contract(ERC20ABI, contracts.ASSETS.DAI);

    //Create graph
    const graph = factory.createGraph(contracts);

    //Create input elements
    let result, element;

    //Create element
    element = elements.INPUT_ETH;
    let id1 = graph.addElement(element, 0, 0);

    //Create operation and connect them
    element = elements.OP_UNISWAP_ETH_TO_DAI;
    let id2 = graph.connectElements([[id1, 0, 0]], element, 0, 1);

    //Create operation and connect them
    element = elements.ADDRESS;
    let id3 = graph.connectElements([[id2, 0, 1]], element, 0, 2);

    //Deploy
    const address = await graph.deploy(web3);
    console.log(address);

    //Load Graph from address
    const loadedGraph = await factory.loadGraph(web3, address);

    const hash1 = md5(JSON.stringify(graph.elements));
    const hash2 = md5(JSON.stringify(loadedGraph.elements));

    expect(hash1).to.equal(hash2);

    //Set execution params
    graph.setExecutionData(id1, 1, "1000000000000000000");
    result = await graph.isElementReadyToExecute(web3, id1);
    expect(result).to.equal("ready");

    //Set execution params
    const toAddress = "0xa8f5e262b61b8C2308a1Cb81fB29739CfB87f97d";
    graph.setExecutionData(id3, 0, toAddress);
    result = await graph.isElementReadyToExecute(web3, id3);
    expect(result).to.equal("ready");

    //Address should not have DAI
    let daiBalance = await daiContract.methods.balanceOf(toAddress).call();
    expect(daiBalance.toString(10)).to.equal("0");

    //Execute
    result = await graph.isReadyToExecute(web3);
    expect(result).to.be.true;

    result = await graph.execute(web3);
    console.log(result);

    const receipt = await web3.eth.getTransactionReceipt(
      result.transactionHash
    );
    console.log(receipt);

     daiBalance = await daiContract.methods.balanceOf(toAddress).call();
     expect(new BN(daiBalance).gt(new BN(1))).to.equal(true);
  });
});
