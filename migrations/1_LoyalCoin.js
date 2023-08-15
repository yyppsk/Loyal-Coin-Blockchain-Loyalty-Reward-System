const LoyalCoin = artifacts.require("./LoyalCoin.sol");
module.exports = function(deployer) {
  deployer.deploy(LoyalCoin, { gas: 5000000, gasPrice: 420420420420 }); // Set an appropriate gas price
};
