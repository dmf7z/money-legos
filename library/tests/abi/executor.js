module.exports = [
  {
    inputs: [],
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
];
