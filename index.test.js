const curlToJs = require('./index');

describe('GET request', () => {
  test('simple GET no quotes', () => {
    const s = 'curl http://google.com/';
    const out = curlToJs(s);
    expect(out.url).toBe('http://google.com/');
    expect(out.method).toBe('GET');
  });

  test('simple GET with single quote', () => {
    const s = 'curl \'http://google.com/\'';
    const out = curlToJs(s);
    expect(out.url).toBe('http://google.com/');
    expect(out.method).toBe('GET');
  });

  test('simple GET with double quote', () => {
    const s = 'curl \"http://google.com/\"';
    const out = curlToJs(s);
    expect(out.url).toBe('http://google.com/');
    expect(out.method).toBe('GET');
  });

  test('simple GET without http', () => {
    const s = 'curl \"www.google.com/\"';
    const out = curlToJs(s);
    expect(out.url).toBe('www.google.com/');
    expect(out.method).toBe('GET');
  });

  test('simple GET with https', () => {
    const s = 'curl \"https://google.com/\"';
    const out = curlToJs(s);
    expect(out.url).toBe('https://google.com/');
    expect(out.method).toBe('GET');
  });

  test('simple GET with IP address', () => {
    const s = 'curl 127.0.0.1';
    const out = curlToJs(s);
    expect(out.url).toBe('127.0.0.1');
    expect(out.method).toBe('GET');
  });

  test('GET with headers (-H)', () => {
    const s = 'curl www.bing.com -H "Accept: application/json" -H "Content-Type: application/json"';
    const out = curlToJs(s);
    expect(out.url).toBe('www.bing.com');
    expect(out.method).toBe('GET');
    expect(out.headers['Accept']).toBe('application/json');
    expect(out.headers['Content-Type']).toBe('application/json');
  });

  test('GET with headers (--header)', () => {
    const s = 'curl www.bing.com --header "Accept: application/json" --header "Content-Type: application/json"';
    const out = curlToJs(s);
    expect(out.url).toBe('www.bing.com');
    expect(out.method).toBe('GET');
    expect(out.headers['Accept']).toBe('application/json');
    expect(out.headers['Content-Type']).toBe('application/json');
  });

  test('GET with url at last', () => {
    const s = 'curl --header "Accept: application/json" --header "Content-Type: application/json" www.bing.com';
    const out = curlToJs(s);
    expect(out.url).toBe('www.bing.com');
    expect(out.method).toBe('GET');
    expect(out.headers['Accept']).toBe('application/json');
    expect(out.headers['Content-Type']).toBe('application/json');
  });
});

describe('POST request', () => {
  test('simple POST without data (-X)', () => {
    const s = 'curl https://jsonplaceholder.typicode.com/posts -X POST';
    const out = curlToJs(s);
    expect(out.url).toBe('https://jsonplaceholder.typicode.com/posts');
    expect(out.method).toBe('POST');
  });

  test('simple POST without data (--request)', () => {
    const s = 'curl https://jsonplaceholder.typicode.com/posts --request POST';
    const out = curlToJs(s);
    expect(out.url).toBe('https://jsonplaceholder.typicode.com/posts');
    expect(out.method).toBe('POST');
  });

  test('POST with json', () => {
    const s = 'curl -X POST -H "Content-Type: application/json" -d \'{"username":"xyz","password":"xyz"}\' http://localhost:3000/api/login';
    const out = curlToJs(s);
    expect(out.url).toBe('http://localhost:3000/api/login');
    expect(out.method).toBe('POST');
    expect(out.headers['Content-Type']).toBe('application/json');
    expect(out.body).toBe('{"username":"xyz","password":"xyz"}');
  });

  test('POST without content type', () => {
    const s = 'curl http://localhost:3000/api/login -X POST -d \"param1=value1&param2=value2\"';
    const out = curlToJs(s);
    expect(out.url).toBe('http://localhost:3000/api/login');
    expect(out.method).toBe('POST');
    expect(out.headers['Content-Type']).toBe('application/x-www-form-urlencoded');
    expect(out.body).toBe('param1=value1&param2=value2');
  });
});

describe('Error handling', () => {
  test('not starts with curl', () => {
    const s = 'xcurl http://google.com/';
    expect(() => {
      curlToJs(s);
    }).toThrow();
  });

  test('unsupported cURL option', () => {
    const spy = jest.spyOn(global.console, 'error')
    const s = 'curl http://google.com/ --fake "fake-data"';
    const out = curlToJs(s);
    expect(out.url).toBe('http://google.com/');
    expect(out.method).toBe('GET');
    expect(spy).toBeCalled();
  });
});
