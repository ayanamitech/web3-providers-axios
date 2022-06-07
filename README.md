# web3-providers-axios

[![Build Status](https://github.com/ayanamitech/web3-providers-axios/actions/workflows/test.yml/badge.svg)](https://github.com/ayanamitech/web3-providers-axios/actions)
[![NPM Package Version](https://img.shields.io/npm/v/web3-providers-axios.svg)](https://npmjs.org/package/web3-providers-axios)
[![NPM Package Downloads](https://img.shields.io/npm/dm/web3-providers-axios.svg)](https://npmjs.org/package/web3-providers-axios)
[![Known Vulnerabilities](https://snyk.io/test/github/ayanamitech/web3-providers-axios/badge.svg?style=flat-square)](https://snyk.io/test/github/ayanamitech/web3-providers-axios)
[![GitHub Views](https://img.shields.io/badge/dynamic/json?color=green&label=Views&query=uniques&url=https://github.com/ayanamitech/node-github-repo-stats/blob/main/data/ayanamitech/web3-providers-axios/views.json?raw=True&logo=github)](https://github.com/ayanamitech/web3-providers-axios)
[![GitHub Clones](https://img.shields.io/badge/dynamic/json?color=success&label=Clone&query=uniques&url=https://github.com/ayanamitech/node-github-repo-stats/blob/main/data/ayanamitech/web3-providers-axios/clone.json?raw=True&logo=github)](https://github.com/ayanamitech/web3-providers-axios)
[![License: MIT](https://img.shields.io/github/license/ayanamitech/web3-providers-axios)](https://www.gnu.org/licenses/gpl-3.0.en.html)

- [About](#about)
- [Installation](#installation)
- [Documentation](#documentation)
- [Usage](#usage)
  - [Browser](#browser)
  - [Example](#example)

## About

> Fault tolerant web3.js compatible JSONRPC provider

**Web3AxiosProvider** is an easy to use [Web3.js](https://web3js.readthedocs.io/en/v1.7.3/) Ethereum JavaScript API provider powered by a powerful [Axios](https://axios-http.com/) HTTP client wrapped by [axios-auto](https://ayanamitech.github.io/axios-auto) library to help your automated error handling & [Promise.any](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any) powered client-side load balancing feature.

## Installation

**Node.js**

```bash
# Wouldn't work without axios or axios-auto installed
npm i --save axios axios-auto web3-providers-axios
```

## Documentation

https://ayanamitech.github.io/web3-providers-axios

## Usage

### Browser

Every release of `web3-providers-axios` will have new build of `./dist/browser/index.js` for use in the browser. To get access to module classes use `Web3AxiosProvider` global variable.

> WARN: We recommend hosting and controlling your own copy for security reasons

```html
<!-- Since Browser bundle comes with axios-auto built in, no need to add additional axios or axios-auto dependency -->
<script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/web3-providers-axios@latest"></script>
```

```html
<!-- Since Browser bundle comes with axios-auto built in, no need to add additional axios or axios-auto dependency -->
<script src="https://unpkg.com/web3@latest/dist/web3.min.js"></script>
<script src="https://unpkg.com/web3-providers-axios@latest"></script>
```

### Web3.js

```js
// CommonJS
const Web3 = require('web3');
const { Web3AxiosProvider } = require('web3-providers-axios');

// ModuleJS / TypeScript
import Web3 from 'web3';
import Web3AxiosProvider from 'web3-providers-axios';

const web3 = new Web3(new Web3AxiosProvider('rpc-host-here'));

web3.eth.getBlockNumber().then(blockNumber => {
  // Will return something like 10000
  console.log(blockNumber);
});
```

### Ethers.js

```js
// CommonJS
const ethers = require('ethers');
const { Web3AxiosProvider } = require('web3-providers-axios');

// ModuleJS / TypeScript
import ethers from 'ethers';
import Web3AxiosProvider from 'web3-providers-axios';

const provider = new ethers.providers.Web3Provider(new Web3AxiosProvider('rpc-host-here'));

provider.getBlockNumber().then(blockNumber => {
  // Will return something like 10000
  console.log(blockNumber);
});
```

### Caver.js

```js
// CommonJS
const Caver = require('caver-js');
const { Web3AxiosProvider } = require('web3-providers-axios');

// ModuleJS / TypeScript
import Caver from 'caver-js';
import Web3AxiosProvider from 'web3-providers-axios';

const caver = new Caver(new Web3AxiosProvider('rpc-host-here'));

caver.klay.getBlockNumber().then(blockNumber => {
  // Will return something like 10000
  console.log(blockNumber);
});
```
