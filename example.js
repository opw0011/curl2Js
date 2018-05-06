const curlToJs = require('./dist/bundle');

const sample1 = "curl 'http://google.com/' \
-H 'Accept-Encoding: gzip, deflate, sdch' \
-H 'Accept-Language: en-US,en;q=0.8,da;q=0.6' \
-H 'Upgrade-Insecure-Requests: 1' \
-H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36' \
-H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' \
-H 'Connection: keep-alive' \
--compressed";

const sample2 = "curl -d '{\"key1\":\"value1\", \"key2\":\"value2\"}' -H 'Content-Type: application/json' -X POST http://localhost:3000/data"

const test1 = curlToJs(sample1);
const test2 = curlToJs(sample2);

console.log('result: \n');
console.log(test1);
console.log(test2);
