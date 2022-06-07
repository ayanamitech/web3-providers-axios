'use strict';

var axiosAuto = require('axios-auto');
var xhr2Cookies = require('xhr2-cookies');
var assert = require('assert');
var Web3 = require('web3');
var Caver = require('caver-js');
var providers = require('@ethersproject/providers');
var axios = require('axios');
var MockAdapter = require('axios-mock-adapter');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Web3__default = /*#__PURE__*/_interopDefaultLegacy(Web3);
var Caver__default = /*#__PURE__*/_interopDefaultLegacy(Caver);
var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);
var MockAdapter__default = /*#__PURE__*/_interopDefaultLegacy(MockAdapter);

class Web3AxiosProvider {
  constructor(host, options, axiosOptions) {
    options = options || {};
    this.host = host || "http://localhost:8545";
    this.withCredentials = options.withCredentials || false;
    this.timeout = options.timeout || 0;
    this.headers = options.headers;
    this.agent = options.agent;
    this.connected = false;
    this.axiosOptions = axiosOptions;
  }
  send(payload, callback) {
    const options = this.axiosOptions || {};
    options.withCredentials = this.withCredentials;
    if (this.timeout) {
      options.timeout = this.timeout;
    }
    if (this.headers) {
      options.headers = this.headers;
    }
    if (typeof xhr2Cookies.XMLHttpRequest === "undefined") {
      const agents = {
        httpsAgent: this.agent ? this.agent.https : void 0,
        httpAgent: this.agent ? this.agent.http : void 0
      };
      if (agents.httpsAgent) {
        options.httpsAgent = agents.httpsAgent;
      } else if (agents.httpAgent) {
        options.httpAgent = agents.httpAgent;
      }
    }
    const success = (response) => {
      if (typeof callback === "function") {
        callback(null, response);
      }
    };
    const error = (response) => {
      if (typeof callback === "function") {
        callback(response, void 0);
      }
    };
    axiosAuto.post(this.host, payload, options).then(success).catch(error);
  }
  _prepareRequest() {
    return new xhr2Cookies.XMLHttpRequest();
  }
  disconnect() {
    return false;
  }
  supportsSubscriptions() {
    return false;
  }
}

describe("web3-providers-axios", () => {
  it("eth_blockNumber", async () => {
    const axiosInstance = axios__default["default"];
    const mock = new MockAdapter__default["default"](axiosInstance, { onNoMatch: "throwException" });
    const web3 = new Web3__default["default"](new Web3AxiosProvider("/", { timeout: 100 }, { axios: axiosInstance, retryMax: 0 }));
    const blockNumber = { "jsonrpc": "2.0", "id": 1, "result": "0x1" };
    mock.onPost("/", { "jsonrpc": "2.0", "id": 1, "method": "eth_blockNumber", "params": [] }).reply(200, blockNumber);
    const result = await web3.eth.getBlockNumber();
    assert.strict.deepEqual(result, 1);
  });
  it("caver-js", async () => {
    const axiosInstance = axios__default["default"];
    const mock = new MockAdapter__default["default"](axiosInstance, { onNoMatch: "throwException" });
    const caver = new Caver__default["default"](new Web3AxiosProvider("/", { timeout: 100 }, { axios: axiosInstance, retryMax: 0 }));
    const blockNumber = { "jsonrpc": "2.0", "id": 1, "result": "0x1" };
    mock.onPost("/", { "jsonrpc": "2.0", "id": 1, "method": "klay_blockNumber", "params": [] }).reply(200, blockNumber);
    const result = await caver.klay.getBlockNumber();
    assert.strict.deepEqual(result, 1);
  });
  it("ethers-Web3Provider", async () => {
    const axiosInstance = axios__default["default"];
    const mock = new MockAdapter__default["default"](axiosInstance, { onNoMatch: "throwException" });
    const provider = new providers.Web3Provider(new Web3AxiosProvider("/", { timeout: 100 }, { axios: axiosInstance, retryMax: 0 }));
    const chainId = { "jsonrpc": "2.0", "id": 1, "result": "0x5" };
    const blockNumber = { "jsonrpc": "2.0", "id": 2, "result": "0x1" };
    mock.onPost("/", { "jsonrpc": "2.0", "id": 1, "method": "eth_chainId", "params": [] }).reply(200, chainId).onPost("/", { "jsonrpc": "2.0", "id": 2, "method": "eth_blockNumber", "params": [] }).reply(200, blockNumber);
    const result = await provider.getBlockNumber();
    assert.strict.deepEqual(result, 1);
  });
});
