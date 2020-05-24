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

describe("Flash swap Graph", function() {
  let contracts;
  let elements;
  before(async function() {
    contracts = await Deployer.deploy();
    elements = Elements(contracts);
  });
  it("Flash swap Graph", async function() {
    //Create graph
    const graph = factory.createGraph(contracts);

    //Create input elements
    let result, element;

    const amount = new BN("997000000");
    const fee = new BN("3000000");

    //Create element
    element = elements.FLASH_SWAP_IN_WETH;
    let id0 = graph.addElement(element, 0, 0, [
      {
        index: 2,
        value: amount.toString(10),
      },
    ]);

    element = elements.INPUT_ETH;
    let id1 = graph.addElement(element, 0, 1, [
      {
        index: 1,
        value: fee.toString(10),
      },
    ]);

    element = elements.OP_WRAPPER_ETH_TO_WETH;
    let id2 = graph.connectElements([[id1, 0, 0]], element, 0, 2);

    //No flashswapout, not ready to deploy
    result = await graph.isReadyToDeploy();
    expect(result).to.be.false;

    element = elements.FLASH_SWAP_OUT_WETH;
    let id3 = graph.connectElements(
      [
        [id0, 0, 0],
        [id2, 0, 0],
      ],
      element,
      0,
      3
    );

    //Has flashswapout, ready to deploy
    result = await graph.isReadyToDeploy();
    expect(result).to.be.true;

    //Deploy
    const address = await graph.deploy(web3);

    //Load Graph from address
    const loadedGraph = await factory.loadGraph(web3, address, contracts);

    const hash1 = md5(JSON.stringify(graph.elements));
    const hash2 = md5(JSON.stringify(loadedGraph.elements));

    expect(hash1).to.equal(hash2);

    //Execute
    result = await loadedGraph.isReadyToExecute(web3);
    expect(result).to.be.true;

    const txHash = await loadedGraph.execute(web3);
    console.log(txHash);
  });
});
