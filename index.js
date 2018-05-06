const CURL_PREFIX = 'curl ';
const SPLIT_REGEX = /\s*(?:([^\s\\\'\"]+)|'((?:[^\'\\]|\\.)*)'|"((?:[^\"\\]|\\.)*)"|(\\.?)|(\S))(\s|$)?/g;
const KEY_VALUE_REGEX = /^['|"]?(\S*)\:\s?((?:[^\\\'\"])*)['|"]?$/;
const DEFAULT_POST_CONTENT_TYPE = 'application/x-www-form-urlencoded';

module.exports = exports.default = (raw) => {
  // TODO: pre-process string to unify the input
  const result = parseCurl(raw);
  return result;
}

const parseCurl = (s) => {
  const str = s.trim();
  if(!str.startsWith(CURL_PREFIX)) throw 'invalid curl string';

  const match = str.match(SPLIT_REGEX);
  const [curl, ...args] = match;

  // args.forEach(arg => console.log(arg));

  const opts = new OptionsBuilder();

  for(let i = 0; i < args.length; i++) {
    const key = args[i];
    const value = (i + 1) < args.length ? args[i+1] : null;
    if (key && key.startsWith('-')) {
      opts.add(key, value);
      i++;
    } else {
      opts.add('URL', key);
    }
  }

  const requestOptions = opts.build();
  // console.log(requestOptions);

  return requestOptions;
}

class OptionsBuilder {
  constructor() {
    this.headers = {};
    this.method = 'GET';
    this.body = undefined;
    this.url = undefined;
  }

  add(type, value) {
    const rType = type && type.trim();
    const rValue = value && value.trim();

    switch(rType) {
      case '-H':
      case '--header':
        this.headers = {...this.headers, ...this.parseKeyValue(rValue)};
        break;
      case '-X':
      case '--request':
        // TODO: validate the request method
        this.method = rValue;
        break;
      case '-d':
      case '--data':
        this.body = this.removeStringQuote(rValue);
        if(!this.headers['Content-Type']) {
          this.headers = { ...this.headers, ...{
            'Content-Type': DEFAULT_POST_CONTENT_TYPE
          }};
        }
        break;
      case 'URL':
        this.url = this.removeStringQuote(rValue);
        break;
      // TODO: handle other types
      default:
        console.error('ERROR: Unsupport arg type', rType)
    }
  }

  parseKeyValue(kv) {
    const match = kv.match(KEY_VALUE_REGEX);
    if (!match) return null;
    return {
      [match[1]]: match[2],
    }
  }

  removeStringQuote(str) {
    let s = str;
    if(str.startsWith('\'') || str.startsWith('"')) {
      s = s.slice(1);
    }
    if(str.endsWith('\'') || str.endsWith('"')) {
      s = s.slice(0, -1);
    }
    return s;
  }

  build() {
    return JSON.parse(JSON.stringify({
      headers: this.headers,
      method: this.method,
      body: this.body,
      url: this.url,
    }));
  }
}
