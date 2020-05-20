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

describe("Donate Graph", function() {
  let contracts;
  let elements;
  before(async function() {
    contracts = await Deployer.deploy(true, true, true); //Buy dai, wbtc and usdc
    elements = Elements(contracts);
  });
  it("Donate Graph", async function() {
    //Add DAI, WBTC,
    const daiContract = new web3.eth.Contract(ERC20ABI, contracts.ASSETS.DAI);
    const usdcContract = new web3.eth.Contract(ERC20ABI, contracts.ASSETS.USDC);
    const wbtcContract = new web3.eth.Contract(ERC20ABI, contracts.ASSETS.WBTC);

    const [account] = await web3.eth.getAccounts();

    let daiBalance = await daiContract.methods.balanceOf(account).call();
    expect(new BN(daiBalance).gt(new BN(1))).to.equal(true);
    let usdcBalance = await usdcContract.methods.balanceOf(account).call();
    expect(new BN(usdcBalance).gt(new BN(1))).to.equal(true);
    let wbtcBalance = await wbtcContract.methods.balanceOf(account).call();
    expect(new BN(wbtcBalance).gt(new BN(1))).to.equal(true);

    //Create graph
    const graph = factory.createGraph(contracts);

    //Create input elements
    let result, element;

    //Create element
    element = elements.INPUT_DAI;
    let id1 = graph.addElement(element, 0, 0, [
      {
        index: 1,
        value: daiBalance.toString(10),
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
        value: usdcBalance.toString(10),
      },
    ]);

    //Create element
    element = elements.INPUT_ETH;
    let id4 = graph.addElement(element, 0, 3, [
      {
        index: 1,
        value: "1000000000000000000",
      },
    ]);

    //Check connection
    let availableElements = graph.getAvailableElements([id2]);
    expect(availableElements.map(element => element.key))
      .to.be.an("array")
      .that.includes(elements.OP_UNISWAP_WBTC_TO_ETH.key);

    //Create operation and connect them
    element = elements.OP_UNISWAP_WBTC_TO_ETH;
    let id5 = graph.connectElements([[id2, 0, 0]], element, 1, 1);

    //Check connection
    availableElements = graph.getAvailableElements([id3]);
    expect(availableElements.map(element => element.key))
      .to.be.an("array")
      .that.includes(elements.OP_UNISWAP_USDC_TO_ETH.key);

    //Create operation and connect them
    element = elements.OP_UNISWAP_USDC_TO_ETH;
    let id6 = graph.connectElements([[id3, 0, 0]], element, 1, 2);

    //Check connection
    availableElements = graph.getAvailableElements([id4, id5, id6]);
    expect(availableElements.map(element => element.key))
      .to.be.an("array")
      .that.includes(elements.OP_UNISWAP_ETH_TO_DAI.key);

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
    expect(availableElements.map(element => element.key))
      .to.be.an("array")
      .that.includes(elements.SPLITTER_DAI.key);

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
    expect(availableElements.map(element => element.key))
      .to.be.an("array")
      .that.includes(elements.ADDRESS.key);

    //Create operation and connect them
    element = elements.ADDRESS;
    let id9 = graph.connectElements([[id8, 0, 1]], element, 4, 0);

    //Create operation and connect them
    element = elements.ADDRESS;
    let id10 = graph.connectElements([[id8, 1, 1]], element, 4, 1);

    //Deploy
    const address = await graph.deploy(web3);
    console.log(address);

    //Load Graph from address
    const loadedGraph = await factory.loadGraph(web3, address, contracts);

    const hash1 = md5(JSON.stringify(graph.elements));
    const hash2 = md5(JSON.stringify(loadedGraph.elements));

    expect(hash1).to.equal(hash2);

    //Set execution params
    graph.setExecutionData(id2, 1, wbtcBalance.toString(10));
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

    //Set execution params
    const toAddress1 = "0x4c3484cC845D9DE01a0e284FFC726ec32A85bA10";
    graph.setExecutionData(id9, 0, toAddress1);
    result = await graph.isElementReadyToExecute(web3, id9);
    expect(result).to.equal("ready");

    //Address 1 should not have DAI
    daiBalance = await daiContract.methods.balanceOf(toAddress1).call();
    expect(daiBalance.toString(10)).to.equal("0");

    const toAddress2 = "0xa16978f6f3Ab62ceF7FDb512d936D1073a8D7544";
    graph.setExecutionData(id10, 0, toAddress2);
    result = await graph.isElementReadyToExecute(web3, id10);
    expect(result).to.equal("ready");

    //Address 2 should not have DAI
    daiBalance = await daiContract.methods.balanceOf(toAddress2).call();
    expect(daiBalance.toString(10)).to.equal("0");

    //Execute
    result = await graph.isReadyToExecute(web3);
    expect(result).to.be.true;

    result = await graph.execute(web3);
    console.log(result);

    daiBalance = await daiContract.methods.balanceOf(toAddress1).call();
    console.log(daiBalance.toString(10));
    expect(new BN(daiBalance).gt(new BN(1))).to.equal(true);

    daiBalance = await daiContract.methods.balanceOf(toAddress2).call();
    console.log(daiBalance.toString(10));
    expect(new BN(daiBalance).gt(new BN(1))).to.equal(true);
  });
});
