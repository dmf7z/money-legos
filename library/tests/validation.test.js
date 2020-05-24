const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");
const Web3 = require("web3");
const BN = require("bn.js");
var md5 = require("md5");
const fetch = require("node-fetch");
const factory = require("../src");
const Elements = require("../src/elements");
const Deployer = require("./deploy/deployer");
const ERC20ABI = require("./abi/erc20");
const OpOasisABI = require("./abi/oasis_matching_market");
const mainContracts = require("../src/common/contracts");

chai.use(chaiAsPromised);
const expect = chai.expect;

var web3 = new Web3(process.env.PROVIDER || "ws://localhost:8545");

const addPrefix = (asset) => {
  return `0xf47261b0000000000000000000000000${asset
    .substring(2)
    .toLowerCase()}`;
};

const getOrder = async (index, asset1, asset2) => {
  const makerAssetData = addPrefix(asset1);
  const takerAssetData = addPrefix(asset2);

  const response = await fetch(
    `https://api.0x.org/sra/v3/orders?makerAssetData=${makerAssetData}&takerAssetData=${takerAssetData}`
  );
  const orders = await response.json();
  return orders.records[index];
};

const getNotExpiringOrder = async (asset1, asset2) => {
  let order;
  let index = 0;
  let time = new Date().getTime() / 1000 + 300; //+ 5 min
  while (!order || parseInt(order.order.expirationTimeSeconds) < time) {
    if (order) console.log(time, parseInt(order.order.expirationTimeSeconds));
    order = await getOrder(index, asset1, asset2);
    index++;
  }
  return order;
};

describe("Graph Validation", function() {
  let contracts;
  let elements;
  let order;
  before(async function() {
    order = await getNotExpiringOrder(
      mainContracts.ASSETS.DAI,
      mainContracts.ASSETS.WETH
    ); //get order first, so it does not expire
    contracts = await Deployer.deploy();
    elements = Elements(contracts);
  });
  it("Graph Validation", async function() {
    const [account] = await web3.eth.getAccounts();

    let initialBalance = await web3.eth.getBalance(account);

    //Create graph
    const graph = factory.createGraph(contracts);

    //Create input elements
    let result, element;

    const amountFlashSwap = new BN("997000000");
    const returnFlashSwap = new BN("1000000000");

    element = elements.FLASH_SWAP_IN_WETH;
    let id00 = graph.addElement(element, 0, 0, [
      {
        index: 2,
        value: amountFlashSwap.toString(10),
      },
    ]);

    element = elements.INPUT_ETH;
    let id0 = graph.addElement(element, 1, 0, [
      {
        index: 1,
        value: ((await web3.eth.getGasPrice()) * 150000).toString(), //0x fee
      },
    ]);

    //Should not be ready to deploy as it does not have outpus
    result = await graph.isReadyToDeploy();
    expect(result).to.be.false;

    //Input
    element = elements.INPUT_ETH;
    let id1 = graph.addElement(element, 0, 0);

    //Wrap ETH
    element = elements.OP_WRAPPER_ETH_TO_WETH;
    let id2 = graph.connectElements([[id1, 0, 0]], element, 0, 1);

    //Check connection just for fun
    let availableElements = graph.getAvailableElements([id2]);
    expect(availableElements.map((element) => element.key))
      .to.be.an("array")
      .that.includes(elements.SPLITTER_WETH.key);

    //Splitter
    element = elements.SPLITTER_WETH;
    let id3 = graph.connectElements(
      [
        [id00, 0, 0],
        [id2, 0, 0],
      ],
      element,
      0,
      2,
      [
        {
          index: 0,
          value: "50",
        },
      ]
    );

    //Oasis
    element = elements.OP_OASIS_WETH_TO_DAI;
    let id4 = graph.connectElements([[id3, 0, 0]], element, 0, 3);

    //Should not be ready to deploy as it does not have outpus
    result = await graph.isReadyToDeploy();
    expect(result).to.be.false;

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

    // //Uniswap
    element = elements.OP_UNISWAP_USDC_TO_ETH;
    let id7 = graph.connectElements([[id6, 0, 0]], element, 1, 6);

    //Wrap ETH
    element = elements.OP_WRAPPER_ETH_TO_WETH;
    let id8 = graph.connectElements([[id7, 0, 0]], element, 0, 1);

    //Fixed Splitter
    element = elements.SPLITTER_FIXED_WETH;
    let id9 = graph.connectElements([[id8, 0, 0]], element, 0, 2, [
      {
        index: 0,
        value: returnFlashSwap.toString(10),
      },
    ]);

    //FlashSwap out
    element = elements.FLASH_SWAP_OUT_WETH;
    let id10 = graph.connectElements([[id9, 0, 0]], element, 0, 3);

    //Unwap WETH
    element = elements.OP_WRAPPER_WETH_TO_ETH;
    let id11 = graph.connectElements([[id9, 1, 0]], element, 0, 1);

    //Should not be ready to deploy as it does not have outpus
    result = await graph.isReadyToDeploy();
    expect(result).to.be.false;

    //Create operation and connect them
    element = elements.ADDRESS;
    let id12 = graph.connectElements([[id11, 0, 0]], element, 1, 7);

    //Should be ready to deploy!!
    result = await graph.isReadyToDeploy();
    expect(result).to.be.true;

    //Deploy
    const address = await graph.deploy(web3);
    console.log(address);

    //Load Graph from address
    const loadedGraph = await factory.loadGraph(web3, address, contracts);

    const hash1 = md5(JSON.stringify(graph.elements));
    const hash2 = md5(JSON.stringify(loadedGraph.elements));

    expect(hash1).to.equal(hash2);

    //Should not be ready to execute
    result = await loadedGraph.isReadyToExecute();
    expect(result).to.be.false;

    //Set execution params for input
    loadedGraph.setExecutionData(id1, 1, "1000000000000000");
    result = await loadedGraph.isElementReadyToExecute(web3, id1);
    expect(result).to.equal("ready");

    //No Oasis order
    result = await loadedGraph.isElementReadyToExecute(web3, id4);
    expect(result).to.equal("Invalid Oasis order");

    //Set execution params for oasis
    const oasisContract = new web3.eth.Contract(
      OpOasisABI,
      contracts.OASIS.OASIS_MATCHING_MARKET
    );
    const offerId = await oasisContract.methods
      .getBestOffer(contracts.ASSETS.DAI, contracts.ASSETS.WETH)
      .call();
    loadedGraph.setExecutionData(id4, 0, offerId);
    result = await loadedGraph.isElementReadyToExecute(web3, id4);
    expect(result).to.equal("ready");

    //No 0x order yet
    result = await loadedGraph.isElementReadyToExecute(web3, id5);
    expect(result).to.equal("Invalid 0x order");
    //Set execution params for 0x
    loadedGraph.setExecutionData(id5, 0, order);
    result = await loadedGraph.isElementReadyToExecute(web3, id5);
    expect(result).to.equal("ready");

    //False: not valid address yet
    result = await loadedGraph.isReadyToExecute();
    expect(result).to.be.false;

    //Invalid address 0x00.000
    result = await loadedGraph.isElementReadyToExecute(web3, id12);
    expect(result).to.equal("Please enter an output address");

    //Set invalida address, not ready
    loadedGraph.setExecutionData(id12, 0, "0x32938293232");
    result = await loadedGraph.isElementReadyToExecute(web3, id12);
    expect(result).to.equal("Invalid address");

    //Set execution params for address
    loadedGraph.setExecutionData(id12, 0, account);
    result = await loadedGraph.isElementReadyToExecute(web3, id12);
    expect(result).to.equal("ready");

    //Should not be ready to execute
    result = await loadedGraph.isReadyToExecute();
    expect(result).to.be.true;
  });
});
