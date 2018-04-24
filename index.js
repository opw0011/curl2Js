const CURL_PREFIX = 'curl ';
const SPLIT_REGEX = /\s*(?:([^\s\\\'\"]+)|'((?:[^\'\\]|\\.)*)'|"((?:[^\"\\]|\\.)*)"|(\\.?)|(\S))(\s|$)?/g;
const KEY_VALUE_REGEX = /^['|"]?(\S*)\:\s?((?:[^\\\'\"])*)['|"]?$/;
const URL_REGEX = /https?:\/\/\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\w]*)*/;

module.exports = exports.default = (raw) => {
  // TODO: pre-process string to unify the input
  const result = parseCurl(raw);
  return result;
}

const preProcess = (str) => {
    return str.trim();
}

const parseCurl = (s) => {
  const str = preProcess(s);
  if(!str.startsWith(CURL_PREFIX)) throw 'invalid curl string';

  const match = str.match(SPLIT_REGEX);
  const [curl, ...args] = match;

  args.forEach(arg => console.log(arg));

  const opts = new OptionsBuilder();

  for(let i = 0; i < args.length; i++) {
    const key = args[i];
    const value = (i + 1) < args.length ? args[i+1] : null;
    if (key && key.startsWith('-')) {
      opts.add(key, value);
      i++;
    } else if(key.match(URL_REGEX)){
      opts.add('URL', key);
    }
  }

  const requestOptions = opts.build();
  console.log(requestOptions);
  
  return requestOptions;
}

class OptionsBuilder {
  constructor() {
    this.headers = {};
    this.method = 'GET';
    this.body = '';
    this.url = '';
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
        this.method = rValue;
        break;
      case '-d':
        this.body = rValue;
        break;
      case 'URL':
        this.url = rValue;
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

  build() {
    return {
      headers: this.headers,
      method: this.method,
      body: this.body,
      url: this.url,
    };
  }
}