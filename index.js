const CURL_PREFIX = 'curl ';
const SPLIT_REGEX = /\s*(?:([^\s\\\'\"]+)|'((?:[^\'\\]|\\.)*)'|"((?:[^\"\\]|\\.)*)"|(\\.?)|(\S))(\s|$)?/g;
const KEY_VALUE_REGEX = /^['|"]?(\S*)\:\s?((?:[^\\\'\"])*)['|"]?$/;

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

  match = str.match(SPLIT_REGEX);
  const [curl, url, ...args] = match;

  let request = {};
  Object.assign(request, {
      url: url,
  });

  match.forEach(arg => console.log(arg));

  const opts = new OptionsBuilder();

  for(let i = 0; i < match.length; i++) {
    const key = match[i];
    const value = (i + 1) < match.length ? match[i+1] : null;
    if (key && key.startsWith('-')) {
      opts.add(key, value);
    }
  }

  const requestOptions = opts.build();

  console.log(requestOptions);
  
  return {...request, ...requestOptions};
}

class OptionsBuilder {
  constructor() {
    this.headers = {};
    this.method = '';
  }

  add(type, value) {
    const rType = type && type.trim();
    const rValue = value && value.trim();

    switch(rType) {
      case '-H':
      case '--header':
        this.headers = {...this.headers, ...this.parseKeyValue(rValue)};
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
    };
  }
}