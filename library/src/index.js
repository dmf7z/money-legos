const Graph = require("./graph/graph");
const Elements = require("./elements");

module.exports = {
  getElements: () => {
    return Elements;
  },
  createGraph: () => {
    return new Graph();
  },
};
