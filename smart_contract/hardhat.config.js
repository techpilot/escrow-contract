require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: ".env" });

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: process.env.ALCHEMY_API_URL,
      accounts: [process.env.WALLET_PRIVATE_KEY],
    },
  },
};
