const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");

const factory = require("../src/factory");
const operations = require("../src/utils/operations");

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Graph", function () {
  it("Donate Graph", async function () {
    //Create graph
    const graph = factory.createGraph();

    //Create input elements
    const inputDAI = factory.createInputElement();
    const inputWBTC = factory.createInputElement();
    const inputUSDC = factory.createInputElement();
    const inputETH = factory.createInputElement();

    //Add inputs to graph
    graph.addInitialElement(inputDAI);
    graph.addInitialElement(inputWBTC);
    graph.addInitialElement(inputUSDC);
    graph.addInitialElement(inputETH);

    //Create operations and connect them
    const op_uniswap_WBTC_to_ETH = factory.createOperationElement(
      operations.OP_UNISWAP_WBTC_TO_ETH
    );
    inputWBTC.connectOutput(0, op_uniswap_WBTC_to_ETH);

    const op_uniswap_USDC_to_ETH = factory.createOperationElement(
      operations.OP_UNISWAP_USDC_TO_ETH
    );
    inputUSDC.connectOutput(0, op_uniswap_USDC_to_ETH);

    const op_uniswap_ETH_to_DAI = factory.createOperationElement(
      operations.OP_UNISWAP_ETH_TO_DAI
    );
    inputETH.connectOutput(0, op_uniswap_ETH_to_DAI);
    op_uniswap_WBTC_to_ETH.connectOutput(0, op_uniswap_ETH_to_DAI);
    op_uniswap_USDC_to_ETH.connectOutput(0, op_uniswap_ETH_to_DAI);

    const splitter = factory.createSplitterElement();
    inputDAI.connectOutput(0, splitter);
    op_uniswap_ETH_to_DAI.connectOutput(0, splitter);

    const address1 = "0x3B8B8830977A3664fF169769c8b67baade0e5f22";
    const address2 = "0x9E19819809927326BdB8C35198673F608c46E658";
    const addressElement1 = factory.createAddressElement(address1);
    const addressElement2 = factory.createAddressElement(address2);

    splitter.connectOutput(0, addressElement1);
    splitter.connectOutput(1, addressElement2);

    //Deploy graph
    const graphAddress = await graph.deploy();

    //Load graph
    const loadedGraph = await factory.loadGraph(graphAddress);

    //Execute graph
    graph.setInputValue(0, "500000000000"); //Donate DAI
    graph.setInputValue(2, "3300000000000"); //Donate USDC
    await loadedGraph.execute();
  });
});
