require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");

const {
  PRIVATE_KEY,
  ALCHEMY_API_KEY_MAINNET,
  ALCHEMY_API_KEY_SEPOLIA,
  ALCHEMY_API_KEY_POLYGON,
  ALCHEMY_API_KEY_MUMBAI,
  ALCHEMY_API_KEY_ARBITRUM,
  ETHERSCAN_API_KEY,
  POLYGONSCAN_API_KEY,
  ARBISCAN_API_KEY
} = process.env;

// デフォルトの秘密鍵（開発環境用）
const DEFAULT_PRIVATE_KEY = "0000000000000000000000000000000000000000000000000000000000000000";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },

  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY_SEPOLIA}`,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [DEFAULT_PRIVATE_KEY],
      chainId: 11155111
    },
    mainnet: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY_MAINNET}`,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [DEFAULT_PRIVATE_KEY],
      chainId: 1
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY_POLYGON}`,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [DEFAULT_PRIVATE_KEY],
      chainId: 137
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY_MUMBAI}`,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [DEFAULT_PRIVATE_KEY],
      chainId: 80001
    },
    arbitrum: {
      url: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY_ARBITRUM}`,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [DEFAULT_PRIVATE_KEY],
      chainId: 42161
    }
  },

  etherscan: {
    apiKey: ARBISCAN_API_KEY || ETHERSCAN_API_KEY,
    customChains: [
      {
        network: "arbitrum",
        chainId: 42161,
        urls: {
          apiURL: "https://api.arbiscan.io/api",
          browserURL: "https://arbiscan.io"
        }
      }
    ]
  },

  sourcify: {
    enabled: true
  }
};
