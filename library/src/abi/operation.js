module.exports = [
  {
    constant: true,
    inputs: [
      {
        internalType: "bytes",
        name: "_params",
        type: "bytes",
      },
    ],
    name: "getInAssets",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
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
        internalType: "bytes",
        name: "_params",
        type: "bytes",
      },
    ],
    name: "getOutAssets",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
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
        internalType: "bytes",
        name: "_params",
        type: "bytes",
      },
    ],
    name: "operate",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
];
