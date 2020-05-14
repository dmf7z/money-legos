// const chaiAsPromised = require("chai-as-promised");
// const chai = require("chai");
// const Web3 = require("web3");
// const factory = require("../library/src/factory");
// const config = require("../library/src/config");
// const assets = config.ASSETS;
// const operations = config.OPERATIONS;

// chai.use(chaiAsPromised);
// const expect = chai.expect;

// var web3 = new Web3(process.env.PROVIDER || "ws://localhost:8545");

// describe("Graph", function () {
//   it("Donate Graph", async function () {
//     //Create graph
//     const graph = factory.createGraph();

//     //Create input elements
//     const inputDAI = factory.createInputElement(assets.DAI);
//     const inputWBTC = factory.createInputElement(assets.WBTC);
//     const inputUSDC = factory.createInputElement(assets.USDC);
//     const inputETH = factory.createInputElement(assets.ETH);

//     //Add inputs to graph
//     graph.addRootElement(inputDAI);
//     graph.addRootElement(inputWBTC);
//     graph.addRootElement(inputUSDC);
//     graph.addRootElement(inputETH);

//     //Create operations and connect them
//     const op_uniswap_WBTC_to_ETH = await factory.createOperationElement(
//       web3,
//       operations.OP_UNISWAP_WBTC_TO_ETH,
//       "0x0"
//     );
//     graph.addElement(inputWBTC, 0, op_uniswap_WBTC_to_ETH, 0);

//     const op_uniswap_USDC_to_ETH = await factory.createOperationElement(
//       web3,
//       operations.OP_UNISWAP_USDC_TO_ETH,
//       "0x0"
//     );
//     graph.addElement(inputUSDC, 0, op_uniswap_USDC_to_ETH, 0);

//     const op_uniswap_ETH_to_DAI = await factory.createOperationElement(
//       web3,
//       operations.OP_UNISWAP_ETH_TO_DAI,
//       "0x0"
//     );
//     graph.addElement(inputETH, 0, op_uniswap_ETH_to_DAI, 0);
//     graph.addElement(op_uniswap_WBTC_to_ETH, 0, op_uniswap_ETH_to_DAI, 0);
//     graph.addElement(op_uniswap_USDC_to_ETH, 0, op_uniswap_ETH_to_DAI, 0);

//     const splitter = factory.createSplitterElement(web3, 0.5); //50% 50%
//     graph.addElement(inputDAI, 0, splitter, 0);
//     graph.addElement(op_uniswap_ETH_to_DAI, 0, splitter, 0);

//     const address1 = "0x3B8B8830977A3664fF169769c8b67baade0e5f22";
//     const address2 = "0x9E19819809927326BdB8C35198673F608c46E658";
//     const addressElement1 = factory.createAddressElement(address1);
//     const addressElement2 = factory.createAddressElement(address2);

//     graph.addElement(splitter, 0, addressElement1, 0);
//     graph.addElement(splitter, 1, addressElement2, 0);

//     //Deploy graph
//     const graphAddress = factory.deployGraph(web3, graph);

//     //Load graph
//     //const loadedGraph = await factory.loadGraph(graphAddress);

//     //Execute graph
//     //graph.setInputValue(0, "500000000000"); //Donate DAI
//     //graph.setInputValue(2, "3300000000000"); //Donate USDC
//     //await loadedGraph.execute();
//   });
// });
