require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("solidity-coverage");

console.log(process.env.POLYGON_MUMBAI_URL);

const POLYGON_MUMBAI_URL = process.env.POLYGON_MUMBAI_URL;
const METAMASK_PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: { url: POLYGON_MUMBAI_URL, accounts: [METAMASK_PRIVATE_KEY] },
    mainnet: { url: "", accounts: [METAMASK_PRIVATE_KEY] },
  },
  solidity: "0.8.9",
};
