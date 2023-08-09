const Flipkartcoin = artifacts.require("./Flipkartcoin.sol");
module.exports = function(deployer) {
  deployer.deploy(Flipkartcoin, { gas: 5000000, gasPrice: 420420420420 }); // Set an appropriate gas price
};
