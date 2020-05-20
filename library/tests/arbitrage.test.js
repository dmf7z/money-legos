const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");
const Web3 = require("web3");
const BN = require("bn.js");
var md5 = require("md5");
const factory = require("../src");
const Elements = require("../src/elements");
const Deployer = require("./deploy/deployer");
const ERC20ABI = require("./abi/erc20");
const OpOasisABI = require("./abi/oasis_matching_market");
const MeshClient = require("@0x/mesh-rpc-client");
const mainContracts = require("../src/common/contracts");

chai.use(chaiAsPromised);
const expect = chai.expect;

var web3 = new Web3(process.env.PROVIDER || "ws://localhost:8545");

const addPrefix = (asset) => {
  return `0xf47261b0000000000000000000000000${asset
    .substring(2)
    .toLowerCase()}`;
};

const isPair = (order, asset1, asset2) => {
  return (
    order.signedOrder.makerAssetData === addPrefix(asset1) &&
    order.signedOrder.takerAssetData === addPrefix(asset2)
  );
};

const getOrder = (contracts) => {
  const client = new MeshClient.WSClient("ws://192.168.1.12:60557");
  return new Promise((resolve, reject) => {
    client.subscribeToOrdersAsync(function(orders) {
      for (let index = 0; index < orders.length; index++) {
        const order = orders[index];
        //order.timestampMs: 1589939913430,
        if (
          isPair(order, contracts.ASSETS.DAI, contracts.ASSETS.WETH) &&
          order.fillableTakerAssetAmount.gt(new BN("1000000000000000000"))
        ) {
          return resolve(order);
        }
      }
    });
  });
};

describe("Arbitrage Graph", function() {
  let contracts;
  let elements;
  let order;
  before(async function() {
    order = await getOrder(mainContracts); //get order first, so it does not expire
    contracts = await Deployer.deploy();
    elements = Elements(contracts);
  });
  it("Arbitrage Graph", async function() {
    const [account] = await web3.eth.getAccounts();

    let initialBalance = await web3.eth.getBalance(account);

    //Create graph
    const graph = factory.createGraph(contracts);

    //Create input elements
    let result, element;

    element = elements.INPUT_ETH;
    let id0 = graph.addElement(element, 1, 0, [
      {
        index: 1,
        value: ((await web3.eth.getGasPrice()) * 150000).toString(), //0x fee
      },
    ]);

    //Input
    element = elements.INPUT_ETH;
    let id1 = graph.addElement(element, 0, 0);

    element = elements.OP_WRAPPER_ETH_TO_WETH;
    let id2 = graph.connectElements([[id1, 0, 0]], element, 0, 1);

    //Check connection just for fun
    let availableElements = graph.getAvailableElements([id2]);
    expect(availableElements.map((element) => element.key))
      .to.be.an("array")
      .that.includes(elements.SPLITTER_WETH.key);

    //Splitter
    element = elements.SPLITTER_WETH;
    let id3 = graph.connectElements([[id2, 0, 0]], element, 0, 2, [
      {
        index: 0,
        value: "50",
      },
    ]);

    //Oasis
    element = elements.OP_OASIS_WETH_TO_DAI;
    let id4 = graph.connectElements([[id3, 0, 0]], element, 0, 3);

    //0x
    element = elements.OP_0x_WETH_TO_DAI;
    let id5 = graph.connectElements(
      [
        [id3, 1, 0],
        [id0, 0, 1],
      ],
      element,
      1,
      4
    );

    //Curve
    element = elements.OP_CURVE_SUSD_DAI_TO_USDC;
    let id6 = graph.connectElements(
      [
        [id4, 0, 0],
        [id5, 0, 0],
      ],
      element,
      1,
      5
    );

    //Uniswap
    element = elements.OP_UNISWAP_USDC_TO_ETH;
    let id7 = graph.connectElements([[id6, 0, 0]], element, 1, 6);

    //Create operation and connect them
    element = elements.ADDRESS;
    let id8 = graph.connectElements([[id7, 0, 0]], element, 1, 7);

    //Deploy
    const address = await graph.deploy(web3);
    console.log(address);

    //Load Graph from address
    const loadedGraph = await factory.loadGraph(web3, address, contracts);

    const hash1 = md5(JSON.stringify(graph.elements));
    const hash2 = md5(JSON.stringify(loadedGraph.elements));

    expect(hash1).to.equal(hash2);

    //Set execution params for input
    graph.setExecutionData(id1, 1, "1000000000000000");
    result = await graph.isElementReadyToExecute(web3, id1);
    expect(result).to.equal("ready");

    //Set execution params for oasis
    const oasisContract = new web3.eth.Contract(
      OpOasisABI,
      contracts.OASIS.OASIS_MATCHING_MARKET
    );
    const offerId = await oasisContract.methods
      .getBestOffer(contracts.ASSETS.DAI, contracts.ASSETS.WETH)
      .call();
    graph.setExecutionData(id4, 0, offerId);
    result = await graph.isElementReadyToExecute(web3, id4);
    expect(result).to.equal("ready");

    const offerResult = await oasisContract.methods.getOffer(offerId).call();
    console.log(offerResult);

    //Set execution params for 0x
    graph.setExecutionData(id5, 0, order);

    //Set execution params for address
    graph.setExecutionData(id8, 0, account);
    result = await graph.isElementReadyToExecute(web3, id8);
    expect(result).to.equal("ready");

    //Execute
    result = await graph.isReadyToExecute(web3);
    expect(result).to.be.true;

    result = await graph.execute(web3);
    console.log(result);

    let finalBalance = await web3.eth.getBalance(account);

    console.log(`Started with ${initialBalance}`);
    console.log(`Finished with ${finalBalance}`);
    if (new BN(finalBalance).gt(new BN(initialBalance))) {
      console.log(":) :) :) gains!");
    } else {
      console.log(":( :( no gains");
    }
  });
});
