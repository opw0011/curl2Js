const curlToJs = require('./dist/bundle');

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
});
