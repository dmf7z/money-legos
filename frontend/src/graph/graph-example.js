// Donate DAI into 2 addresses

export const DONATE_V2 = [
  {
    id: "stack00-00",
    type: "InputElement",
    input: "",
    output: "wbtc",
    connections: ["stack00-01"],
    index: [0,0]
  },
  {
    id: "stack01-00",
    type: "InputElement",
    input: "",
    output: "usdc",
    connections: ["stack01-01"],
    index: [1,0]
  },
  {
    id: "stack02-00",
    type: "InputElement",
    input: "",
    output: "eth",
    connections: ["stack02-02"],
    index: [2,0]

  },
  {
    id: "stack00-01",
    type: "OperationElement",
    input: "wbtc",
    output: "eth",
    connections: ["stack02-02"],
    index: [0,1]

  },
  {
    id: "stack01-01",
    type: "OperationElement",
    input: "usdc",
    output: "eth",
    connections: ["stack02-02"],
    index: [1,1]

  },
  {
    id: "stack02-02",
    type: "SplitterElement",
    input: "",
    output: "eth",
    connections: ["stack01-03", "stack02-03"],
    index: [2,2]
  },
  {
    id: "stack01-03",
    type: "AddressElement",
    address: "0x9E19819809927326BdB8C35198673F608c46E658",
    addreinput: "",
    output: "",
    connections: [],
    index: [1,3]
  },
  {
    id: "stack02-03",
    type: "AddressElement",
    address: "0x3B8B8830977A3664fF169769c8b67baade0e5f22",
    input: "",
    output: "",
    connections: [],
    index: [2,3]
  },
];


export const DONATE_PARTIAL = [
  {
    id: "stack00-00",
    type: "InputElement",
    input: "",
    output: "wbtc",
    connections: [],
    // connections: ["stack00-01"],
    index: [0,0]
  },
  {
    id: "stack01-00",
    type: "InputElement",
    input: "",
    output: "usdc",
    connections: ["stack01-01"],
    index: [1,0]
  },
  {
    id: "stack02-00",
    type: "InputElement",
    input: "",
    output: "eth",
    connections: ["stack02-02"],
    index: [2,0]

  },
  // {
  //   id: "stack00-01",
  //   type: "OperationElement",
  //   input: "wbtc",
  //   output: "eth",
  //   connections: ["stack02-02"],
  //   index: [0,1]

  // },
  {
    id: "stack01-01",
    type: "OperationElement",
    input: "usdc",
    output: "eth",
    connections: ["stack02-02"],
    index: [1,1]

  },
  {
    id: "stack02-02",
    type: "SplitterElement",
    input: "",
    output: "eth",
    connections: ["stack01-03", "stack02-03"],
    index: [2,2]
  },
  {
    id: "stack01-03",
    type: "AddressElement",
    address: "0x9E19819809927326BdB8C35198673F608c46E658",
    addreinput: "",
    output: "",
    connections: [],
    index: [1,3]
  },
  {
    id: "stack02-03",
    type: "AddressElement",
    address: "0x3B8B8830977A3664fF169769c8b67baade0e5f22",
    input: "",
    output: "",
    connections: [],
    index: [2,3]
  },
];
