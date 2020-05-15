const path = require("path");

module.exports = {
  target: "web",
  entry: {
    MoneyLegos: ["./library/src/factory.js"],
  },
  output: {
    path: path.resolve(__dirname, "./lib"),
    library: "MoneyLegos",
  },
};
