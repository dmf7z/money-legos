const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");
const Web3 = require("web3");
var md5 = require("md5");
const factory = require("../src");
const elements = require("../src/elements");

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
    let id1 = graph.addElement(element, 0, 0, [
      {
        index: 1,
        value: "1000000000000000000",
      },
    ]);

    //Create element
    element = elements.INPUT_WBTC;
    let id2 = graph.addElement(element, 0, 1);

    //Create element
    element = elements.INPUT_USDC;
    let id3 = graph.addElement(element, 0, 2, [
      {
        index: 1,
        value: "1000000000000000000",
      },
    ]);

    //Create element
    element = elements.INPUT_ETH;
    let id4 = graph.addElement(element, 0, 3);

    //Check connection
    let availableElements = graph.getAvailableElements([id2]);
    expect(availableElements)
      .to.be.an("array")
      .that.includes(elements.OP_UNISWAP_WBTC_TO_ETH);

    //Create operation and connect them
    element = elements.OP_UNISWAP_WBTC_TO_ETH;
    let id5 = graph.connectElements([[id2, 0, 0]], element, 1, 1);

    //Check connection
    availableElements = graph.getAvailableElements([id3]);
    expect(availableElements)
      .to.be.an("array")
      .that.includes(elements.OP_UNISWAP_USDC_TO_ETH);

    //Create operation and connect them
    element = elements.OP_UNISWAP_USDC_TO_ETH;
    let id6 = graph.connectElements([[id3, 0, 0]], element, 1, 2);

    //Check connection
    availableElements = graph.getAvailableElements([id4, id5, id6]);
    expect(availableElements)
      .to.be.an("array")
      .that.includes(elements.OP_UNISWAP_ETH_TO_DAI);

    //Create operation and connect them
    element = elements.OP_UNISWAP_ETH_TO_DAI;
    let id7 = graph.connectElements(
      [
        [id4, 0, 0],
        [id5, 0, 0],
        [id6, 0, 0],
      ],
      element,
      2,
      0
    );

    //Check connection
    availableElements = graph.getAvailableElements([id1, id7]);
    expect(availableElements)
      .to.be.an("array")
      .that.includes(elements.SPLITTER_DAI);

    //Create operation and connect them
    element = elements.SPLITTER_DAI;
    let id8 = graph.connectElements(
      [
        [id1, 0, 0],
        [id7, 0, 0],
      ],
      element,
      3,
      0,
      [
        {
          index: 0,
          value: "30",
        },
      ]
    );

    //Check connection
    availableElements = graph.getAvailableElements([id8]);
    expect(availableElements)
      .to.be.an("array")
      .that.includes(elements.ADDRESS);

    //Create operation and connect them
    element = elements.ADDRESS;
    let id9 = graph.connectElements([[id8, 0, 1]], element, 4, 0);

    //Create operation and connect them
    element = elements.ADDRESS;
    let id10 = graph.connectElements([[id8, 1, 1]], element, 4, 0);

    //Deploy
    const address = await graph.deploy(web3);
    console.log(address);

    //Load Graph from address
    const loadedGraph = await factory.loadGraph(web3, address);

    const hash1 = md5(JSON.stringify(graph.elements));
    const hash2 = md5(JSON.stringify(loadedGraph.elements));

    expect(hash1).to.equal(hash2);

    //Set execution params
    graph.setExecutionData(id2, 1, "1000000000000000000");
    result = await graph.isElementReadyToExecute(web3, id2);
    expect(result).to.equal("Not enough allowance for the input value");
    //Add validation
    await graph.allowInputElement(web3, id1);
    await graph.allowInputElement(web3, id2);
    await graph.allowInputElement(web3, id3);
    await graph.allowInputElement(web3, id4);
    result = await graph.isElementReadyToExecute(web3, id1);
    expect(result).to.equal("ready");
    result = await graph.isElementReadyToExecute(web3, id2);
    expect(result).to.equal("ready");
    result = await graph.isElementReadyToExecute(web3, id3);
    expect(result).to.equal("ready");
    result = await graph.isElementReadyToExecute(web3, id4);
    expect(result).to.equal("ready");

    //Execute
    result = await graph.isReadyToExecute(web3);
    expect(result).to.be.true;

    result = await graph.execute(web3);
     console.log(result);
  });
});
