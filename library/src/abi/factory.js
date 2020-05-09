module.exports = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "MetaOperationCreated",
    type: "event",
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
            components: [
              {
                internalType: "address",
                name: "asset",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
              {
                internalType: "bool",
                name: "isPercentage",
                type: "bool",
              },
              {
                internalType: "address payable",
                name: "to",
                type: "address",
              },
            ],
            internalType: "struct Base.Out[]",
            name: "outs",
            type: "tuple[]",
          },
          {
            internalType: "bytes",
            name: "params",
            type: "bytes",
          },
        ],
        internalType: "struct Base.Operation[]",
        name: "_operations",
        type: "tuple[]",
      },
    ],
    name: "deploy",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];
