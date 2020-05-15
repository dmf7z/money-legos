const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");
const Web3 = require("web3");
const factory = require("../library/src/factory");
const elements = require("../library/src/elements");

chai.use(chaiAsPromised);
const expect = chai.expect;

var web3 = new Web3(process.env.PROVIDER || "ws://localhost:8545");

describe("Graph", function() {
  it("Donate Graph", async function() {
    //Create graph
    const graph = factory.createGraph();

    //Create input elements
    let result, element;

    //Create element
    element = elements.INPUT_DAI;
    result = graph.isElementReadyToCreate(element);
    expect(result).to.be.true;
    //Add element to graph
    let id1 = graph.addElement(element, 0, 0);

    //Create element
    element = elements.INPUT_WBTC;
    result = graph.isElementReadyToCreate(element);
    expect(result).to.be.true;
    //Add element to graph
    let id2 = graph.addElement(element, 0, 1);

    //Create element
    element = elements.INPUT_USDC;
    result = graph.isElementReadyToCreate(element);
    expect(result).to.be.true;
    //Add element to graph
    let id3 = graph.addElement(element, 0, 2);

    //Create element
    element = elements.INPUT_ETH;
    result = graph.isElementReadyToCreate(element);
    expect(result).to.be.true;
    //Add element to graph
    let id4 = graph.addElement(element, 0, 3);

    //Create operation and connect them
    element = elements.OP_UNISWAP_WBTC_TO_ETH;
    result = graph.isElementReadyToCreate(element);
    expect(result).to.be.true;
    //Add element to graph
    let id5 = graph.connectElements([[id2, 0]], element, 0, 1, 1);

    element = elements.OP_UNISWAP_USDC_TO_ETH;
    result = graph.isElementReadyToCreate(element);
    expect(result).to.be.true;
    //Add element to graph
    let id6 = graph.connectElements([[id3, 0]], element, 0, 1, 2);

    element = elements.OP_UNISWAP_ETH_TO_DAI;
    result = graph.isElementReadyToCreate(element);
    expect(result).to.be.true;
    //Add element to graph
    let id7 = graph.connectElements(
      [
        [id4, 0],
        [id5, 0],
        [id6, 0],
      ],
      element,
      0,
      2,
      0
    );

    element = elements.SPLITTER_DAI;
    result = graph.isElementReadyToCreate(element);
    expect(result).to.be.true;
    //Add element to graph
    let id8 = graph.connectElements(
      [
        [id1, 0],
        [id7, 0],
      ],
      element,
      0,
      3,
      0
    );

    element = elements.ADDRESS;
    result = graph.isElementReadyToCreate(element);
    expect(result).to.be.true;
    //Add element to graph
    let id9 = graph.connectElements([[id8, 0]], element, 1, 4, 0);

    console.log(JSON.stringify(graph.elements));

    // const op_uniswap_ETH_to_DAI = await factory.createOperationElement(
    //   web3,
    //   operations.OP_UNISWAP_ETH_TO_DAI,
    //   "0x0"
    // );
    // graph.addElement(inputETH, 0, op_uniswap_ETH_to_DAI, 0);
    // graph.addElement(op_uniswap_WBTC_to_ETH, 0, op_uniswap_ETH_to_DAI, 0);
    // graph.addElement(op_uniswap_USDC_to_ETH, 0, op_uniswap_ETH_to_DAI, 0);

    // const splitter = factory.createSplitterElement(web3, 0.5); //50% 50%
    // graph.addElement(inputDAI, 0, splitter, 0);
    // graph.addElement(op_uniswap_ETH_to_DAI, 0, splitter, 0);

    // const address1 = "0x3B8B8830977A3664fF169769c8b67baade0e5f22";
    // const address2 = "0x9E19819809927326BdB8C35198673F608c46E658";
    // const addressElement1 = factory.createAddressElement(address1);
    // const addressElement2 = factory.createAddressElement(address2);

    // graph.addElement(splitter, 0, addressElement1, 0);
    // graph.addElement(splitter, 1, addressElement2, 0);

    // //Deploy graph
    // const graphAddress = factory.deployGraph(web3, graph);

    //Load graph
    //const loadedGraph = await factory.loadGraph(graphAddress);

    //Execute graph
    //graph.setInputValue(0, "500000000000"); //Donate DAI
    //graph.setInputValue(2, "3300000000000"); //Donate USDC
    //await loadedGraph.execute();
  });
});
