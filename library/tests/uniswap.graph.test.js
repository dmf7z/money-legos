const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");
const Web3 = require("web3");
var md5 = require("md5");
const factory = require("../src");
const elements = require("../src/elements");

chai.use(chaiAsPromised);
const expect = chai.expect;

var web3 = new Web3(process.env.PROVIDER || "ws://localhost:8545");

describe("Uniswap Graph", function() {
  it("Uniswap Graph", async function() {
    //Create graph
    const graph = factory.createGraph();

    //Create input elements
    let result, element;

    //Create element
    element = elements.INPUT_ETH;
    let id1 = graph.addElement(element, 0, 0);

  

    //Create operation and connect them
    element = elements.OP_UNISWAP_ETH_TO_DAI;
    let id2 = graph.connectElements(
      [
        [id1, 0, 0]
      ],
      element,
      0,
      1
    );

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

    //Execute
    result = await graph.isReadyToExecute(web3);
    expect(result).to.be.true;

    result = await graph.execute(web3);
     console.log(result);
  });
});
