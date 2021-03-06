'use strict';

var axiosAuto = require('axios-auto');
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
    this.filter = options.filter;
    this.axiosOptions = axiosOptions;
  }
  send(payload, callback) {
    var _a;
    const options = this.axiosOptions || {};
    options.withCredentials = this.withCredentials;
    const filter = (data, count, retryMax) => {
      if (typeof count === "number" && typeof retryMax === "number") {
        if (Array.isArray(data)) {
          const errorArray = data.map((d) => {
            let message;
            if (d.error) {
              message = typeof d.error.message === "string" ? d.error.message : typeof d.error === "string" ? d.error : typeof d.error === "object" ? JSON.stringify(d.error) : "";
            } else if (typeof d.result === "undefined") {
              message = typeof d === "string" ? d : typeof d === "object" ? JSON.stringify(d) : "Result not available from remote node";
            }
            if (typeof message !== "undefined" && count < retryMax + 1) {
              return new Error(message);
            }
          }).filter((d) => d);
          if (errorArray.length > 0) {
            throw errorArray;
          }
        } else {
          let message;
          if (data.error) {
            message = typeof data.error.message === "string" ? data.error.message : typeof data.error === "string" ? data.error : typeof data.error === "object" ? JSON.stringify(data.error) : "";
          } else if (typeof data.result === "undefined") {
            message = typeof data === "string" ? data : typeof data === "object" ? JSON.stringify(data) : "Result not available from remote node";
          }
          if (typeof message !== "undefined" && count < retryMax + 1) {
            throw new Error(message);
          }
        }
      }
    };
    options.filter = this.filter || filter;
    if (this.timeout) {
      options.timeout = this.timeout;
    }
    if (this.headers) {
      options.headers = this.headers;
    }
    options.headers || (options.headers = {});
    (_a = options.headers)["Content-Type"] || (_a["Content-Type"] = "application/json");
    if (typeof XMLHttpRequest === "undefined") {
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
    const sendTxMethods = ["eth_sendRawTransaction", "eth_sendTransaction", "klay_sendRawTransaction", "klay_sendTransaction"];
    let sendTransaction = false;
    if (Array.isArray(payload)) {
      payload.forEach((req) => {
        if (sendTxMethods.includes(req.method)) {
          sendTransaction = true;
        }
      });
    } else {
      if (sendTxMethods.includes(payload.method)) {
        sendTransaction = true;
      }
    }
    if (sendTransaction) {
      axiosAuto.post(this.host.replace(/\s+/g, "").split(",")[0], payload, options).then(success).catch(error);
    } else {
      axiosAuto.post(this.host, payload, options).then(success).catch(error);
    }
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
