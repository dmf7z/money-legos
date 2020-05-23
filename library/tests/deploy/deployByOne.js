const Web3 = require("web3");

const { projectId, mnemonic } = require("../../../../secrets.main.json");
const HDWalletProvider = require("@truffle/hdwallet-provider");

const contracts = require("../../src/common/contracts");

const OperationExecutor = require("../../build/contracts/OperationExecutor.json");
const Op_WrapETH = require("../../build/contracts/Op_WrapETH.json");
const Op_0x = require("../../build/contracts/Op_0x.json");
const Op_Compound = require("../../build/contracts/Op_Compound.json");
const Op_Uniswap = require("../../build/contracts/Op_Uniswap.json");
const Op_Uniswap_V2 = require("../../build/contracts/Op_Uniswap_V2.json");
const Op_Curve = require("../../build/contracts/Op_Curve.json");
const Op_Oasis = require("../../build/contracts/Op_Oasis.json");
const Uniswap = require("../../build/contracts/IUniswap.json");
const GraphFactory = require("../../build/contracts/GraphFactory.json");
const Graph = require("../../build/contracts/Graph.json");

var web3 = new Web3(
  new HDWalletProvider(mnemonic, `https://mainnet.infura.io/v3/${projectId}`)
);

module.exports = {
  getAdmin: async () => {
    const [admin] = await web3.eth.getAccounts();
    console.log(admin);
    const balance = await web3.eth.getBalance(admin);
    console.log(balance);
  },
  deployOP_WRAP_ETH: async () => {
    console.log("OPERATIONS.OP_WRAP_ETH");
    const [admin] = await web3.eth.getAccounts();
    const opWrapEthContract = new web3.eth.Contract(Op_WrapETH.abi);
    const opWrapEthInstance = await opWrapEthContract
      .deploy({
        data: Op_WrapETH.bytecode,
        arguments: [],
      })
      .send({
        from: admin,
        gas: 1500000,
        gasPrice: 13000000000,
      });
    console.log("OPERATIONS.OP_WRAP_ETH", opWrapEthInstance.options.address);
  },
  deployOP_0X: async () => {
    console.log("OPERATIONS.OP_0X");
    const [admin] = await web3.eth.getAccounts();
    const op0xContract = new web3.eth.Contract(Op_0x.abi);
    const op0xInstance = await op0xContract
      .deploy({
        data: Op_0x.bytecode,
        arguments: [],
      })
      .send({
        from: admin,
        gas: 1500000,
        gasPrice: 13000000000,
      });
    console.log("OPERATIONS.OP_0X", op0xInstance.options.address);
  },
  deployOP_COMPOUND: async () => {
    console.log("OPERATIONS.OP_COMPOUND");
    const [admin] = await web3.eth.getAccounts();
    const compoundContract = new web3.eth.Contract(Op_Compound.abi);
    const compoundInstance = await compoundContract
      .deploy({
        data: Op_Compound.bytecode,
        arguments: [],
      })
      .send({
        from: admin,
        gas: 1500000,
        gasPrice: 13000000000,
      });
    console.log("OPERATIONS.OP_COMPOUND", compoundInstance.options.address);
  },
  deployOP_UNISWAP: async () => {
    console.log("OPERATIONS.OP_UNISWAP");
    const [admin] = await web3.eth.getAccounts();
    const uniswapContract = new web3.eth.Contract(Op_Uniswap.abi);
    const uniswapInstance = await uniswapContract
      .deploy({
        data: Op_Uniswap.bytecode,
        arguments: [],
      })
      .send({
        from: admin,
        gas: 1500000,
        gasPrice: 13000000000,
      });
    console.log("OPERATIONS.OP_UNISWAP", uniswapInstance.options.address);
  },
  deployOP_UNISWAP_V2: async () => {
    console.log("OPERATIONS.OP_UNISWAP_V2");
    const [admin] = await web3.eth.getAccounts();
    const uniswapContractV2 = new web3.eth.Contract(Op_Uniswap_V2.abi);
    const uniswapInstanceV2 = await uniswapContractV2
      .deploy({
        data: Op_Uniswap_V2.bytecode,
        arguments: [],
      })
      .send({
        from: admin,
        gas: 1500000,
        gasPrice: 13000000000,
      });
    console.log("OPERATIONS.OP_UNISWAP_V2", uniswapInstanceV2.options.address);
  },
  deployOP_CURVE: async () => {
    console.log("OPERATIONS.OP_CURVE");
    const [admin] = await web3.eth.getAccounts();
    const curveContract = new web3.eth.Contract(Op_Curve.abi);
    const curveInstance = await curveContract
      .deploy({
        data: Op_Curve.bytecode,
        arguments: [],
      })
      .send({
        from: admin,
        gas: 1000000,
        gasPrice: 13000000000,
      });
    console.log("OPERATIONS.OP_CURVE", curveInstance.options.address);
  },
  deployOP_OASIS: async () => {
    console.log("OPERATIONS.OP_OASIS");
    const [admin] = await web3.eth.getAccounts();
    const oasisContract = new web3.eth.Contract(Op_Oasis.abi);
    const oasisInstance = await oasisContract
      .deploy({
        data: Op_Oasis.bytecode,
        arguments: [],
      })
      .send({
        from: admin,
        gasPrice: 13000000000,
      });
    console.log("OPERATIONS.OP_OASIS", oasisInstance.options.address);
  },
  deployFACTORY: async () => {
    console.log("FACTORY");
    const [admin] = await web3.eth.getAccounts();
    const factoryContract = new web3.eth.Contract(GraphFactory.abi);
    const factoryInstance = await factoryContract
      .deploy({
        data: GraphFactory.bytecode,
        arguments: [],
      })
      .send({
        from: admin,
        gasPrice: 13000000000,
      });
    console.log("FACTORY", factoryInstance.options.address);
  },
};
