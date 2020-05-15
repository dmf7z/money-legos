const path = require('path');
module.exports = {
  target: "web",
  entry: {
    Defire: ["./src/index.js"]
  },
  output: {
    path: path.resolve(__dirname, "./dist/"),
    filename: "defire.js",
    library: 'Defire'
  },
  devtool: 'inline-source-map',
}