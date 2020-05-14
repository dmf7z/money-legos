module.exports = [
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
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
        components: [
          {
            internalType: "address",
            name: "makerAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "takerAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "feeRecipientAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "senderAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "makerAssetAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "takerAssetAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "makerFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "takerFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expirationTimeSeconds",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "salt",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "makerAssetData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "takerAssetData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "makerFeeAssetData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "takerFeeAssetData",
            type: "bytes",
          },
        ],
        internalType: "struct IExchange.Order",
        name: "order",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "encodeParams",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    payable: false,
    stateMutability: "pure",
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
    name: "isValidOrderSignature",
    outputs: [
      {
        internalType: "bool",
        name: "isValid",
        type: "bool",
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
    name: "operate",
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
];
