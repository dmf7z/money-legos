const Web3 = require("web3");
var web3 = new Web3(process.env.PROVIDER || "ws://localhost:8545");

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

module.exports = {
  deploy: async (buyDAI = false, buyWBTC = false, buyUSDC = false) => {
    const [admin] = await web3.eth.getAccounts();

    const operationExecutorContract = new web3.eth.Contract(
      OperationExecutor.abi
    );
    const operationExecutorInstance = await operationExecutorContract
      .deploy({
        data: OperationExecutor.bytecode,
        arguments: [],
      })
      .send({
        from: admin,
        gas: 1500000,
      });
    contracts.OPERATION_EXECUTOR = operationExecutorInstance.options.address;

    const opWrapEthContract = new web3.eth.Contract(Op_WrapETH.abi);
    const opWrapEthInstance = await opWrapEthContract
      .deploy({
        data: Op_WrapETH.bytecode,
        arguments: [],
      })
      .send({
        from: admin,
        gas: 1500000,
      });
    contracts.OPERATIONS.OP_WRAP_ETH = opWrapEthInstance.options.address;

    const op0xContract = new web3.eth.Contract(Op_0x.abi);
    const op0xInstance = await op0xContract
      .deploy({
        data: Op_0x.bytecode,
        arguments: [],
      })
      .send({
        from: admin,
        gas: 1500000,
      });
    contracts.OPERATIONS.OP_0X = op0xInstance.options.address;

    const compoundContract = new web3.eth.Contract(Op_Compound.abi);
    const compoundInstance = await compoundContract
      .deploy({
        data: Op_Compound.bytecode,
        arguments: [],
      })
      .send({
        from: admin,
        gas: 1500000,
      });
    contracts.OPERATIONS.OP_COMPOUND = compoundInstance.options.address;

    const uniswapContract = new web3.eth.Contract(Op_Uniswap.abi);
    const uniswapInstance = await uniswapContract
      .deploy({
        data: Op_Uniswap.bytecode,
        arguments: [],
      })
      .send({
        from: admin,
        gas: 1500000,
      });
    contracts.OPERATIONS.OP_UNISWAP = uniswapInstance.options.address;

    const uniswapContractV2 = new web3.eth.Contract(Op_Uniswap_V2.abi);
    const uniswapInstanceV2 = await uniswapContractV2
      .deploy({
        data: Op_Uniswap_V2.bytecode,
        arguments: [],
      })
      .send({
        from: admin,
        gas: 1500000,
      });
    contracts.OPERATIONS.OP_UNISWAP_V2 = uniswapInstanceV2.options.address;

    const curveContract = new web3.eth.Contract(Op_Curve.abi);
    const curveInstance = await curveContract
      .deploy({
        data: Op_Curve.bytecode,
        arguments: [],
      })
      .send({
        from: admin,
        gas: 1500000,
      });
    contracts.OPERATIONS.OP_CURVE = curveInstance.options.address;

    const oasisContract = new web3.eth.Contract(Op_Oasis.abi);
    const oasisInstance = await oasisContract
      .deploy({
        data: Op_Oasis.bytecode,
        arguments: [],
      })
      .send({
        from: admin,
        gas: 1500000,
      });
    contracts.OPERATIONS.OP_OASIS = oasisInstance.options.address;

    const graphContract = new web3.eth.Contract(Graph.abi);
    const graphInstance = await graphContract
      .deploy({
        data: Graph.bytecode,
        arguments: [[]],
      })
      .send({
        from: admin,
        gas: 4500000,
      });
    contracts.GRAPH = graphInstance.options.address;

    const factoryContract = new web3.eth.Contract(GraphFactory.abi);
    const factoryInstance = await factoryContract
      .deploy({
        data: GraphFactory.bytecode,
        arguments: [contracts.GRAPH],
      })
      .send({
        from: admin,
        gas: 1500000,
      });
    contracts.FACTORY = factoryInstance.options.address;

    console.log(JSON.stringify(contracts));

    

    //Buy DAI to admin
    const secondsToToday = new Date().getTime() / 1000;
    deadline = Math.floor(secondsToToday + 300); // 5 minutes from now

    if (buyDAI) {
      const uniswapDAI = new web3.eth.Contract(
        Uniswap.abi,
        contracts.UNISWAP.UNISWAP_EXCHANGE_DAI_ETH
      );
      await uniswapDAI.methods.ethToTokenSwapInput("1", deadline).send({
        from: admin,
        gas: 1500000,
        value: "1000000000000000000",
      });
      console.log("Bought DAI for admin");
    }
    if (buyWBTC) {
      const uniswapWBTC = new web3.eth.Contract(
        Uniswap.abi,
        contracts.UNISWAP.UNISWAP_EXCHANGE_WBTC_ETH
      );
      await uniswapWBTC.methods.ethToTokenSwapInput("1", deadline).send({
        from: admin,
        gas: 1500000,
        value: "1000000000000000000",
      });
      console.log("Bought WBTC for admin");
    }
    if (buyUSDC) {
      const uniswapUSDC = new web3.eth.Contract(
        Uniswap.abi,
        contracts.UNISWAP.UNISWAP_EXCHANGE_USDC_ETH
      );
      await uniswapUSDC.methods.ethToTokenSwapInput("1", deadline).send({
        from: admin,
        gas: 1500000,
        value: "1000000000000000000",
      });
      console.log("Bought USDC for admin");
    }
    return contracts;
  },
};
