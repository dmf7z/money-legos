module.exports = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "hash",
            type: "string",
          },
          {
            internalType: "address",
            name: "addr",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "params",
            type: "bytes",
          },
          {
            internalType: "uint64[]",
            name: "outputsIndexes",
            type: "uint64[]",
          },
          {
            internalType: "uint64[]",
            name: "outputsInputIndexes",
            type: "uint64[]",
          },
          {
            internalType: "uint8",
            name: "x",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "y",
            type: "uint8",
          },
        ],
        internalType: "struct GraphBase.Element[]",
        name: "_elements",
        type: "tuple[]",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback",
  },
  {
    constant: true,
    inputs: [],
    name: "VERSION",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "elements",
    outputs: [
      {
        internalType: "string",
        name: "hash",
        type: "string",
      },
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "params",
        type: "bytes",
      },
      {
        internalType: "uint8",
        name: "x",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "y",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "bytes[]",
        name: "_paramsList",
        type: "bytes[]",
      },
      {
        internalType: "uint256",
        name: "_maxElementInputs",
        type: "uint256",
      },
    ],
    name: "execute",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_operation",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "_inAmounts",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "_params",
        type: "bytes",
      },
    ],
    name: "executeOperation",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "addr",
            type: "address",
          },
          {
            internalType: "uint256[]",
            name: "inAmounts",
            type: "uint256[]",
          },
          {
            internalType: "bytes",
            name: "params",
            type: "bytes",
          },
        ],
        internalType: "struct OperationExecutor.Operation[]",
        name: "_operations",
        type: "tuple[]",
      },
    ],
    name: "executeOperations",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getElements",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "hash",
            type: "string",
          },
          {
            internalType: "address",
            name: "addr",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "params",
            type: "bytes",
          },
          {
            internalType: "uint64[]",
            name: "outputsIndexes",
            type: "uint64[]",
          },
          {
            internalType: "uint64[]",
            name: "outputsInputIndexes",
            type: "uint64[]",
          },
          {
            internalType: "uint8",
            name: "x",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "y",
            type: "uint8",
          },
        ],
        internalType: "struct GraphBase.Element[]",
        name: "",
        type: "tuple[]",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];
