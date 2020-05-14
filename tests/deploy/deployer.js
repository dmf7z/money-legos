const Web3 = require("web3");
var web3 = new Web3(process.env.PROVIDER || "ws://localhost:8545");

const contracts = require("../../common/contracts");

const OperationExecutor = require("../../build/contracts/OperationExecutor.json");
const Op_WrapETH = require("../../build/contracts/Op_WrapETH.json");
const Op_0x = require("../../build/contracts/Op_0x.json");
const Op_Compound = require("../../build/contracts/Op_Compound.json");

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

    console.log(contracts);

    return contracts;
  },
};
