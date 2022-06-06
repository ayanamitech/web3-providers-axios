const Web3 = require('web3');
const { Web3AxiosProvider } = require('./dist/cjs');

const web3 = new Web3(new Web3AxiosProvider('https://bsc-dataseed.binance.org'));

web3.eth.getBlockNumber().then(r => console.log(r));
