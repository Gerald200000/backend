const request = require('supertest');
const app = require('../src/app');

describe('Health check', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('GET /unknown returns 404', async () => {
    const res = await request(app).get('/unknown');
    expect(res.status).toBe(404);
  });
});

describe('Base64', () => {
  it('encodes text', async () => {
    const res = await request(app)
      .post('/api/tools/base64/encode')
      .send({ text: 'hello' });
    expect(res.status).toBe(200);
    expect(res.body.result).toBe('aGVsbG8=');
  });

  it('decodes text', async () => {
    const res = await request(app)
      .post('/api/tools/base64/decode')
      .send({ text: 'aGVsbG8=' });
    expect(res.status).toBe(200);
    expect(res.body.result).toBe('hello');
  });

  it('returns 400 on missing text', async () => {
    const res = await request(app).post('/api/tools/base64/encode').send({});
    expect(res.status).toBe(400);
  });
});

describe('URL encode/decode', () => {
  it('encodes URL', async () => {
    const res = await request(app)
      .post('/api/tools/url/encode')
      .send({ text: 'hello world' });
    expect(res.status).toBe(200);
    expect(res.body.result).toBe('hello%20world');
  });

  it('decodes URL', async () => {
    const res = await request(app)
      .post('/api/tools/url/decode')
      .send({ text: 'hello%20world' });
    expect(res.status).toBe(200);
    expect(res.body.result).toBe('hello world');
  });

  it('returns 400 on invalid URL-encoded input', async () => {
    const res = await request(app)
      .post('/api/tools/url/decode')
      .send({ text: '%GG' });
    expect(res.status).toBe(400);
  });
});

describe('JSON tools', () => {
  it('formats JSON', async () => {
    const res = await request(app)
      .post('/api/tools/json/format')
      .send({ json: '{"a":1}' });
    expect(res.status).toBe(200);
    expect(res.body.result).toBe('{\n  "a": 1\n}');
  });

  it('minifies JSON', async () => {
    const res = await request(app)
      .post('/api/tools/json/minify')
      .send({ json: '{\n  "a": 1\n}' });
    expect(res.status).toBe(200);
    expect(res.body.result).toBe('{"a":1}');
  });

  it('returns 400 on invalid JSON', async () => {
    const res = await request(app)
      .post('/api/tools/json/format')
      .send({ json: 'not json' });
    expect(res.status).toBe(400);
  });
});

describe('Hash', () => {
  it('hashes with sha256 by default', async () => {
    const res = await request(app)
      .post('/api/tools/hash')
      .send({ text: 'hello' });
    expect(res.status).toBe(200);
    expect(res.body.algorithm).toBe('sha256');
    expect(res.body.result).toBe(
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
    );
  });

  it('hashes with md5', async () => {
    const res = await request(app)
      .post('/api/tools/hash')
      .send({ text: 'hello', algorithm: 'md5' });
    expect(res.status).toBe(200);
    expect(res.body.result).toBe('5d41402abc4b2a76b9719d911017c592');
  });

  it('returns 400 on unsupported algorithm', async () => {
    const res = await request(app)
      .post('/api/tools/hash')
      .send({ text: 'hello', algorithm: 'rot13' });
    expect(res.status).toBe(400);
  });
});

describe('UUID generator', () => {
  it('generates a uuid', async () => {
    const res = await request(app).get('/api/tools/uuid');
    expect(res.status).toBe(200);
    expect(res.body.result).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });
});

describe('Text tools', () => {
  it('counts words/chars/lines', async () => {
    const res = await request(app)
      .post('/api/tools/text/wordcount')
      .send({ text: 'hello world\nfoo' });
    expect(res.status).toBe(200);
    expect(res.body.characters).toBe(15);
    expect(res.body.words).toBe(3);
    expect(res.body.lines).toBe(2);
  });

  it('reverses text', async () => {
    const res = await request(app)
      .post('/api/tools/text/reverse')
      .send({ text: 'hello' });
    expect(res.status).toBe(200);
    expect(res.body.result).toBe('olleh');
  });

  it('converts to uppercase', async () => {
    const res = await request(app)
      .post('/api/tools/text/case')
      .send({ text: 'hello world', transform: 'upper' });
    expect(res.status).toBe(200);
    expect(res.body.result).toBe('HELLO WORLD');
  });

  it('converts to title case', async () => {
    const res = await request(app)
      .post('/api/tools/text/case')
      .send({ text: 'hello world', transform: 'title' });
    expect(res.status).toBe(200);
    expect(res.body.result).toBe('Hello World');
  });

  it('returns 400 on bad transform', async () => {
    const res = await request(app)
      .post('/api/tools/text/case')
      .send({ text: 'hello', transform: 'camel' });
    expect(res.status).toBe(400);
  });
});
