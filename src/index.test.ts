import Web3AxiosProvider from './index';
import { strict as assert } from 'assert';
import Web3 from 'web3';
import Caver from 'caver-js';
import { Web3Provider } from '@ethersproject/providers';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

/**
  Test specs written according to

  https://eth.wiki/json-rpc/API
  https://web3js.readthedocs.io/en/v1.7.3/web3-eth.html
**/
describe('web3-providers-axios', () => {
  it('eth_blockNumber', async () => {
    const axiosInstance = axios;
    const mock = new MockAdapter(axiosInstance, { onNoMatch: 'throwException' });
    const web3 = new Web3(new Web3AxiosProvider('/', { timeout: 100 }, { axios: axiosInstance, retryMax: 0 }));
    const blockNumber = { 'jsonrpc': '2.0', 'id': 1, 'result': '0x1' };
    mock.onPost('/', { 'jsonrpc': '2.0', 'id': 1, 'method': 'eth_blockNumber', 'params': [] }).reply(200, blockNumber);
    const result = await web3.eth.getBlockNumber();
    assert.deepEqual(result, 1);
  });
  it('caver-js', async () => {
    const axiosInstance = axios;
    const mock = new MockAdapter(axiosInstance, { onNoMatch: 'throwException' });
    const caver = new Caver(new Web3AxiosProvider('/', { timeout: 100 }, { axios: axiosInstance, retryMax: 0 }));
    const blockNumber = { 'jsonrpc': '2.0', 'id': 1, 'result': '0x1' };
    mock.onPost('/', { 'jsonrpc': '2.0', 'id': 1, 'method': 'klay_blockNumber', 'params': [] }).reply(200, blockNumber);
    const result = await caver.klay.getBlockNumber();
    assert.deepEqual(result, 1);
  });
  /**
    https://docs.ethers.io/v5/api/providers/other/#Web3Provider
  **/
  it('ethers-Web3Provider', async () => {
    const axiosInstance = axios;
    const mock = new MockAdapter(axiosInstance, { onNoMatch: 'throwException' });
    const provider = new Web3Provider(new Web3AxiosProvider('/', { timeout: 100 }, { axios: axiosInstance, retryMax: 0 }));
    const chainId = { 'jsonrpc': '2.0', 'id': 1, 'result': '0x5' };
    const blockNumber = { 'jsonrpc': '2.0', 'id': 2, 'result': '0x1' };
    mock
      .onPost('/', { 'jsonrpc': '2.0', 'id': 1, 'method': 'eth_chainId', 'params': [] })
      .reply(200, chainId)
      .onPost('/', { 'jsonrpc': '2.0', 'id': 2, 'method': 'eth_blockNumber', 'params': [] })
      .reply(200, blockNumber);
    // https://docs.ethers.io/v5/api/providers/provider/#Provider--block-methods
    const result = await provider.getBlockNumber();
    assert.deepEqual(result, 1);
  });
});
