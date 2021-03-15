require('babel-register');
require('babel-polyfill');
require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider');
const privateKeys = process.env.PRIVATE_KEY || ""

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    fantom: {
      provider: function() {
        return new HDWalletProvider(
          privateKeys.split(','), // Array of account private keys
          `https://rpc.fantom.network/`// Url to an Ethereum Node
        )
      },
     
      gas: 8000000,
      gasPrice: 40000000000,
      network_id: 250
    },
    mainnet: {
      provider: function() {
        return new HDWalletProvider(
          privateKeys.split(','), // Array of account private keys
          `wss://mainnet.infura.io/ws/v3/${process.env.INFURA_API_KEY}`// Url to an Ethereum Node
        )
      },
      gas: 1200000,
      gasPrice: 50000000000,
      network_id: 1
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider(
          privateKeys.split(','), // Array of account private keys
          `wss://kovan.infura.io/ws/v3/${process.env.INFURA_API_KEY}`// Url to an Ethereum Node
        )
      },
      gas: 12000000,
      gasPrice: 25000000000,
      network_id: 42
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(
          privateKeys.split(','), // Array of account private keys
          `wss://ropsten.infura.io/ws/v3/${process.env.INFURA_API_KEY}`// Url to an Ethereum Node
        )
      },
      gas: 8000000,
      gasPrice: 35000000000,
      network_id: 3
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(
          privateKeys.split(','), // Array of account private keys
          `wss://rinkeby.infura.io/ws/v3/${process.env.INFURA_API_KEY}`// Url to an Ethereum Node
        )
      },
      gas: 8000000,
      gasPrice: 35000000000,
      network_id: 4
    },
    goerli: {
      provider: function() {
        return new HDWalletProvider(
          privateKeys.split(','), // Array of account private keys
          `wss://goerli.infura.io/ws/v3/${process.env.INFURA_API_KEY}`// Url to an Ethereum Node
        )
      },
      gas: 8000000,
      gasPrice: 35000000000,
      network_id: 5
    },
  },
  
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: "EZUSQCBM9JZE3BZ9BSYSG8HVQA1YQJEBHT"
  },
  // Configure your compilers
  compilers: {
    solc: {
       version: "0.7.0",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
        enabled: true,
        runs: 100
        },
      }//  evmVersion: "byzantium"
    }
  }
};
