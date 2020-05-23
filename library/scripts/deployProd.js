const readline = require("readline");
const Deployer = require("../tests/deploy/deployByOne");

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function input(prompt, callback) {
  rl.question(prompt, function(x) {
    rl.close();
    callback(x);
  });
}

function main() {
  console.log("1 - getAdmin");
  console.log("2 - deployOP_WRAP_ETH");
  console.log("3 - deployOP_0X");
  console.log("4 - deployOP_COMPOUND");
  console.log("5 - deployOP_UNISWAP");
  console.log("6 - deployOP_UNISWAP_V2");
  console.log("7 - deployOP_CURVE");
  console.log("8 - deployOP_OASIS");
  console.log("9 - deployFACTORY");
  input("Select option: ", (n) => {
    switch (n.toString()) {
      case "1": {
        Deployer.getAdmin();
        break;
      }
      case "2": {
        Deployer.deployOP_WRAP_ETH();
        break;
      }
      case "3": {
        Deployer.deployOP_0X();
        break;
      }
      case "4": {
        Deployer.deployOP_COMPOUND();
        break;
      }
      case "5": {
        Deployer.deployOP_UNISWAP();
        break;
      }
      case "6": {
        Deployer.deployOP_UNISWAP_V2();
        break;
      }
      case "7": {
        Deployer.deployOP_CURVE();
        break;
      }
      case "8": {
        Deployer.deployOP_OASIS();
        break;
      }
      case "9": {
        Deployer.deployFACTORY();
        break;
      }
    }
  });
}

main();
