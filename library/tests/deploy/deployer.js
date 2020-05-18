const Web3 = require("web3");
var web3 = new Web3(process.env.PROVIDER || "ws://localhost:8545");

const contracts = require("../../src/common/contracts");

const OperationExecutor = require("../../build/contracts/OperationExecutor.json");
const Op_WrapETH = require("../../build/contracts/Op_WrapETH.json");
const Op_0x = require("../../build/contracts/Op_0x.json");
const Op_Compound = require("../../build/contracts/Op_Compound.json");
const Op_Uniswap = require("../../build/contracts/Op_Uniswap.json");
const Op_Curve = require("../../build/contracts/Op_Curve.json");
const Op_Oasis = require("../../build/contracts/Op_Oasis.json");

module.exports = {
  deploy: async () => {
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

    console.log(contracts);

    return contracts;
  },
};
