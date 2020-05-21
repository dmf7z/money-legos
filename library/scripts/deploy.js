const Deployer = require("../tests/deploy/deployer");

const deploy = async () => {
  const contracts = await Deployer.deploy();
  console.log(contracts);
};

deploy();
