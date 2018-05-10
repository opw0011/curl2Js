[![npm version](https://img.shields.io/npm/v/curl2js.svg?style=flat)](https://www.npmjs.com/package/curl2js)
[![Build Status](https://travis-ci.org/opw0011/curl2js.svg?branch=master)](https://travis-ci.org/opw0011/curl2js)
[![codecov](https://img.shields.io/codecov/c/github/opw0011/curl2js.svg)](https://codecov.io/gh/opw0011/curl2js)


# curl2js 

[![NPM](https://nodei.co/npm/curl2js.png)](https://nodei.co/npm/curl2js/)

curl2js is a nodejs library to convert cURL to javascript.

## Getting Started

### Installation

```
npm install curl2js --save
```

### Sample Usage

```js
const curl2js = require('curl2js');

const result = curl2js("curl google.com -H 'Accept: application/json' -H 'Content-Type: application/json'");
console.log(result);

// { 
//    headers: { 
//      Accept: 'application/json',
//      'Content-Type': 'application/json' 
//    },
//    method: 'GET',
//    url: 'google.com' 
// }

```
