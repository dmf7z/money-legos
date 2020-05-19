const mainnetContracts = require("./common/contracts");

module.exports = (contracts = mainnetContracts) => {
  const addInputElement = (elements, name) => {
    elements[`INPUT_${name}`] = {
      key: `INPUT_${name}`,
      type: "InputElement",
      instrument: "Local",
      description: "Input token to start",
      address: "0x0000000000000000000000000000000000000001",
      inputs: [],
      outputs: [contracts.ASSETS[name]],
      connections: [],
      executionData: [
        {
          type: "raw",
          dataType: "address",
          data: contracts.ASSETS[name],
        },
        {
          type: "input",
          dataType: "uint256",
          title: `Amount of ${name}`,
          description: `Please enter the amount of ${name} to execute`,
          required: true,
          data: "1",
          min: "1",
        },
      ],
    };
  };

  const addUniswapOperations = (elements, name) => {
    elements[`OP_UNISWAP_${name}_TO_ETH`] = {
      key: `OP_UNISWAP_${name}_TO_ETH`,
      type: "OperationElement",
      instrument: "Uniswap",
      description: `Trade ${name} for ETH`,
      address: contracts.OPERATIONS.OP_UNISWAP,
      inputs: [contracts.ASSETS[name]],
      outputs: [contracts.ASSETS.ETH],
      connections: [],
      executionData: [
        {
          type: "raw",
          dataType: "address",
          data: contracts.UNISWAP[`UNISWAP_EXCHANGE_${name}_ETH`],
        },
        {
          type: "raw",
          dataType: "address",
          data: contracts.ASSETS[name],
        },
        {
          type: "raw",
          dataType: "bool",
          data: true,
        },
        {
          type: "input",
          dataType: "uint256",
          title: "Min amount",
          description: "Please enter the min amount of ETH to buy",
          required: false,
          default: "1",
          data: "1",
        },
        {
          type: "input",
          dataType: "timestamp",
          title: "Deadline",
          description:
            "Please enter the deadline for trade to expire in seconds",
          required: false,
          default: "4745221884", //year 2120
          data: "4745221884",
        },
      ],
    };
    elements[`OP_UNISWAP_ETH_TO_${name}`] = {
      key: `OP_UNISWAP_ETH_TO_${name}`,
      type: "OperationElement",
      instrument: "Uniswap",
      description: `Trade ETH for ${name}`,
      address: contracts.OPERATIONS.OP_UNISWAP,
      inputs: [contracts.ASSETS.ETH],
      outputs: [contracts.ASSETS[name]],
      connections: [],
      executionData: [
        {
          type: "raw",
          dataType: "address",
          data: contracts.UNISWAP[`UNISWAP_EXCHANGE_${name}_ETH`],
        },
        {
          type: "raw",
          dataType: "address",
          data: contracts.ASSETS[name],
        },
        {
          type: "raw",
          dataType: "bool",
          data: false,
        },
        {
          type: "input",
          dataType: "uint256",
          title: "Min amount",
          description: `Please enter the min amount of ${name} to buy`,
          required: false,
          default: "1",
          data: "1",
        },
        {
          type: "input",
          dataType: "timestamp",
          title: "Deadline",
          description:
            "Please enter the deadline for trade to expire in seconds",
          required: false,
          default: "4745221884", //year 2120
          data: "4745221884",
        },
      ],
    };
  };

  const add0xOperations = (elements, asset1, asset2) => {
    elements[`OP_0x_${asset1}_TO_${asset2}`] = {
      key: `OP_0x_${asset1}_TO_${asset2}`,
      type: "OperationElement",
      instrument: "0x",
      description: `Trade ${asset1} for ${asset2}`,
      address: contracts.OPERATIONS.OP_0X,
      inputs: [contracts.ASSETS[asset1]],
      outputs: [contracts.ASSETS[asset2]],
      connections: [],
      executionData: [
        {
          type: "input",
          dataType: "0xOrder",
          title: "Order",
          description: "0x order to execute",
          required: true,
          data: "0x0",
        },
        {
          type: "input",
          dataType: "0xSignature",
          title: "Signature",
          description: "0x order signature to execute",
          required: true,
          data: "0x0",
        },
        {
          type: "raw",
          dataType: "address",
          data: [contracts.ASSETS[asset1]],
        },
      ],
    };
    elements[`OP_0x_${asset2}_TO_${asset1}`] = {
      key: `OP_0x_${asset2}_TO_${asset1}`,
      type: "OperationElement",
      instrument: "0x",
      description: `Trade ${asset2} for ${asset1}`,
      address: contracts.OPERATIONS.OP_0X,
      inputs: [contracts.ASSETS[asset2]],
      outputs: [contracts.ASSETS[asset1]],
      connections: [],
      executionData: [
        {
          type: "input",
          dataType: "0xOrder",
          title: "Order",
          description: "0x order to execute",
          required: true,
          data: "0x0",
        },
        {
          type: "input",
          dataType: "0xSignature",
          title: "Signature",
          description: "0x order signature to execute",
          required: true,
          data: "0x0",
        },
        {
          type: "raw",
          dataType: "address",
          data: [contracts.ASSETS[asset2]],
        },
      ],
    };
  };

  const addCompoundOperations = (elements, asset, cAsset) => {
    elements[`OP_COMPOUND_${asset}_TO_${cAsset}`] = {
      key: `OP_COMPOUND_${asset}_TO_${cAsset}`,
      type: "OperationElement",
      instrument: "Compound",
      description: `Lend ${asset}, get ${cAsset}`,
      address: contracts.OPERATIONS.OP_COMPOUND,
      inputs: [contracts.ASSETS[asset]],
      outputs: [contracts.ASSETS[cAsset]],
      connections: [],
      executionData: [
        {
          type: "raw",
          dataType: "address",
          data: [contracts.ASSETS[cAsset]],
        },
        {
          type: "raw",
          dataType: "address",
          data: [contracts.ASSETS[asset]],
        },
        {
          type: "raw",
          dataType: "bool",
          data: [true],
        },
      ],
    };
    elements[`OP_COMPOUND_${cAsset}_TO_${asset}`] = {
      key: `OP_COMPOUND_${cAsset}_TO_${asset}`,
      type: "OperationElement",
      instrument: "Compound",
      description: `Redeem ${cAsset}, get ${asset}`,
      address: contracts.OPERATIONS.OP_COMPOUND,
      inputs: [contracts.ASSETS[cAsset]],
      outputs: [contracts.ASSETS[asset]],
      connections: [],
      executionData: [
        {
          type: "raw",
          dataType: "address",
          data: [contracts.ASSETS[cAsset]],
        },
        {
          type: "raw",
          dataType: "address",
          data: [contracts.ASSETS[asset]],
        },
        {
          type: "raw",
          dataType: "bool",
          data: [false],
        },
      ],
    };
  };

  const addCurveSUSDOperations = (elements, asset1, asset2) => {
    elements[`OP_CURVE_SUSD_${asset1}_TO_${asset2}`] = {
      key: `OP_CURVE_SUSD_${asset1}_TO_${asset2}`,
      type: "OperationElement",
      instrument: "Curve",
      description: `Trade ${asset1} for ${asset2}`,
      address: contracts.OPERATIONS.OP_CURVE,
      inputs: [contracts.ASSETS[asset1]],
      outputs: [contracts.ASSETS[asset2]],
      connections: [],
      executionData: [
        {
          type: "raw",
          dataType: "address",
          data: contracts.CURVE.CURVE_POOL_DAI_USDC_USDT_SUSD.address,
        },
        {
          type: "raw",
          dataType: "address",
          data: contracts.ASSETS[asset1],
        },
        {
          type: "raw",
          dataType: "uint128",
          data: contracts.CURVE.CURVE_POOL_DAI_USDC_USDT_SUSD.indexes.indexOf(
            asset1
          ),
        },
        {
          type: "raw",
          dataType: "uint128",
          data: contracts.CURVE.CURVE_POOL_DAI_USDC_USDT_SUSD.indexes.indexOf(
            asset2
          ),
        },
        {
          type: "raw",
          dataType: "uint256",
          data: ["1"],
        },
      ],
    };
    elements[`OP_CURVE_SUSD_${asset2}_TO_${asset1}`] = {
      key: `OP_CURVE_SUSD_${asset2}_TO_${asset1}`,
      type: "OperationElement",
      instrument: "Curve",
      description: `Trade ${asset2} for ${asset1}`,
      address: contracts.OPERATIONS.OP_CURVE,
      inputs: [contracts.ASSETS[asset2]],
      outputs: [contracts.ASSETS[asset1]],
      connections: [],
      executionData: [
        {
          type: "raw",
          dataType: "address",
          data: contracts.CURVE.CURVE_POOL_DAI_USDC_USDT_SUSD.address,
        },
        {
          type: "raw",
          dataType: "address",
          data: contracts.ASSETS[asset2],
        },
        {
          type: "raw",
          dataType: "uint128",
          data: contracts.CURVE.CURVE_POOL_DAI_USDC_USDT_SUSD.indexes.indexOf(
            asset2
          ),
        },
        {
          type: "raw",
          dataType: "uint128",
          data: contracts.CURVE.CURVE_POOL_DAI_USDC_USDT_SUSD.indexes.indexOf(
            asset1
          ),
        },
        {
          type: "raw",
          dataType: "uint256",
          data: ["1"],
        },
      ],
    };
  };

  const addOasisOperations = (elements, asset1, asset2) => {
    elements[`OP_OASIS_${asset1}_TO_${asset2}`] = {
      key: `OP_OASIS_${asset1}_TO_${asset2}`,
      type: "OperationElement",
      instrument: "Oasis",
      description: `Trade ${asset1} for ${asset2}`,
      address: contracts.OPERATIONS.OP_OASIS,
      inputs: [contracts.ASSETS[asset1]],
      outputs: [contracts.ASSETS[asset2]],
      connections: [],
      executionData: [
        {
          type: "input",
          dataType: "uint256",
          title: "Order Id",
          description: "Id of Oasis order",
          required: true,
          data: "0",
        },
      ],
    };
    elements[`OP_OASIS_${asset2}_TO_${asset1}`] = {
      key: `OP_OASIS_${asset2}_TO_${asset1}`,
      type: "OperationElement",
      instrument: "Oasis",
      description: `Trade ${asset2} for ${asset1}`,
      address: contracts.OPERATIONS.OP_OASIS,
      inputs: [contracts.ASSETS[asset2]],
      outputs: [contracts.ASSETS[asset1]],
      connections: [],
      executionData: [
        {
          type: "input",
          dataType: "uint256",
          title: "Order Id",
          description: "Id of Oasis order",
          required: true,
          data: "0",
        },
      ],
    };
  };

  const addWrapOperations = (elements) => {
    elements[`OP_WRAPPER_ETH_TO_WETH`] = {
      key: `OP_WRAPPER_ETH_TO_WETH`,
      type: "OperationElement",
      instrument: "WETH",
      description: `Wrap ETH into WETH`,
      address: contracts.OPERATIONS.OP_WRAP_ETH,
      inputs: [contracts.ASSETS.ETH],
      outputs: [contracts.ASSETS.WETH],
      connections: [],
      executionData: [
        {
          type: "raw",
          dataType: "bool",
          data: [true],
        },
      ],
    };
    elements[`OP_WRAPPER_WETH_TO_ETH`] = {
      key: `OP_WRAPPER_WETH_TO_ETH`,
      type: "OperationElement",
      instrument: "WETH",
      description: `Unwrap ETH into WETH`,
      address: contracts.OPERATIONS.OP_WRAP_ETH,
      inputs: [contracts.ASSETS.WETH],
      outputs: [contracts.ASSETS.ETH],
      connections: [],
      executionData: [
        {
          type: "raw",
          dataType: "bool",
          data: [false],
        },
      ],
    };
  };

  const addSplitterElement = (elements, name) => {
    elements[`SPLITTER_${name}`] = {
      key: `SPLITTER_${name}`,
      type: "SplitterElement",
      instrument: "Local",
      description: `Split ${name} in two`,
      address: "0x0000000000000000000000000000000000000002",
      inputs: [contracts.ASSETS[name]],
      outputs: [contracts.ASSETS[name], contracts.ASSETS[name]],
      connections: [],
      executionData: [
        {
          type: "input",
          dataType: "uint8",
          min: 0,
          max: 100,
          title: "% of split",
          description: "Please enter a percentage to split. Default: 50%",
          required: false,
          default: "50",
          data: "50",
        },
      ],
    };
  };

  const addAddressElement = (elements) => {
    elements["ADDRESS"] = {
      key: "ADDRESS",
      type: "AddressElement",
      instrument: "Local",
      description: "Ethereum address to receive assets",
      address: "0x0000000000000000000000000000000000000003",
      inputs: [
        contracts.ASSETS.ETH,
        contracts.ASSETS.DAI,
        contracts.ASSETS.WETH,
        contracts.ASSETS.USDC,
        contracts.ASSETS.USDT,
        contracts.ASSETS.SUSD,
        contracts.ASSETS.WBTC,
        contracts.ASSETS.REP,
        contracts.ASSETS.CDAI,
        contracts.ASSETS.CUSDC,
        contracts.ASSETS.CWBTC,
        contracts.ASSETS.CETH,
      ],
      outputs: [],
      connections: [],
      executionData: [
        {
          type: "input",
          dataType: "address",
          title: "Destination address",
          description: "Please enter the destination address",
          required: true,
          data: "0x0000000000000000000000000000000000000000",
        },
      ],
    };
  };

  const elements = {};

  //Add inputs
  for (asset in contracts.ASSETS) {
    addInputElement(elements, asset);
  }

  //Add Uniswap operations
  addUniswapOperations(elements, "WBTC");
  addUniswapOperations(elements, "USDC");
  addUniswapOperations(elements, "DAI");

  //Add 0x operations
  add0xOperations(elements, "WBTC", "WETH");
  add0xOperations(elements, "DAI", "WETH");
  add0xOperations(elements, "REP", "WETH");
  add0xOperations(elements, "USDC", "WETH");
  add0xOperations(elements, "USDT", "WETH");
  add0xOperations(elements, "SUSD", "WETH");
  add0xOperations(elements, "WBTC", "DAI");
  add0xOperations(elements, "USDC", "DAI");
  add0xOperations(elements, "USDT", "DAI");
  add0xOperations(elements, "SUSD", "DAI");

  //Add Compound operations
  addCompoundOperations(elements, "DAI", "CDAI");
  addCompoundOperations(elements, "USDC", "CUSDC");
  addCompoundOperations(elements, "WBTC", "CWBTC");
  addCompoundOperations(elements, "ETH", "CETH");

  //Add Curve operations
  addCurveSUSDOperations(elements, "DAI", "USDC");
  addCurveSUSDOperations(elements, "DAI", "USDT");
  addCurveSUSDOperations(elements, "DAI", "SUSD");
  addCurveSUSDOperations(elements, "USDC", "USDT");
  addCurveSUSDOperations(elements, "USDC", "SUSD");
  addCurveSUSDOperations(elements, "USDT", "SUSD");

  //Add Oasis operations
  addOasisOperations(elements, "DAI", "WETH");
  addOasisOperations(elements, "DAI", "REP");

  //Add Wrap operations
  addWrapOperations(elements);

  //Add splitters
  for (asset in contracts.ASSETS) {
    addSplitterElement(elements, asset);
  }

  //Add address
  addAddressElement(elements);

  return elements;
};
