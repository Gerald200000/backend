const express = require('express');
const crypto = require('crypto');

const router = express.Router();

/**
 * POST /api/tools/base64/encode
 * Body: { text: string }
 * Encodes plain text to Base64.
 */
router.post('/base64/encode', (req, res) => {
  const { text } = req.body;
  if (typeof text !== 'string') {
    return res.status(400).json({ error: 'Field "text" (string) is required.' });
  }
  const encoded = Buffer.from(text).toString('base64');
  return res.json({ result: encoded });
});

/**
 * POST /api/tools/base64/decode
 * Body: { text: string }
 * Decodes a Base64 string to plain text.
 */
router.post('/base64/decode', (req, res) => {
  const { text } = req.body;
  if (typeof text !== 'string') {
    return res.status(400).json({ error: 'Field "text" (string) is required.' });
  }
  try {
    const decoded = Buffer.from(text, 'base64').toString('utf8');
    return res.json({ result: decoded });
  } catch {
    return res.status(400).json({ error: 'Invalid Base64 input.' });
  }
});

/**
 * POST /api/tools/url/encode
 * Body: { text: string }
 * URL-encodes the given text.
 */
router.post('/url/encode', (req, res) => {
  const { text } = req.body;
  if (typeof text !== 'string') {
    return res.status(400).json({ error: 'Field "text" (string) is required.' });
  }
  return res.json({ result: encodeURIComponent(text) });
});

/**
 * POST /api/tools/url/decode
 * Body: { text: string }
 * URL-decodes the given text.
 */
router.post('/url/decode', (req, res) => {
  const { text } = req.body;
  if (typeof text !== 'string') {
    return res.status(400).json({ error: 'Field "text" (string) is required.' });
  }
  try {
    return res.json({ result: decodeURIComponent(text) });
  } catch {
    return res.status(400).json({ error: 'Invalid URL-encoded input.' });
  }
});

/**
 * POST /api/tools/json/format
 * Body: { json: string }
 * Formats (pretty-prints) a JSON string.
 */
router.post('/json/format', (req, res) => {
  const { json } = req.body;
  if (typeof json !== 'string') {
    return res.status(400).json({ error: 'Field "json" (string) is required.' });
  }
  try {
    const parsed = JSON.parse(json);
    return res.json({ result: JSON.stringify(parsed, null, 2) });
  } catch {
    return res.status(400).json({ error: 'Invalid JSON input.' });
  }
});

/**
 * POST /api/tools/json/minify
 * Body: { json: string }
 * Minifies a JSON string.
 */
router.post('/json/minify', (req, res) => {
  const { json } = req.body;
  if (typeof json !== 'string') {
    return res.status(400).json({ error: 'Field "json" (string) is required.' });
  }
  try {
    const parsed = JSON.parse(json);
    return res.json({ result: JSON.stringify(parsed) });
  } catch {
    return res.status(400).json({ error: 'Invalid JSON input.' });
  }
});

/**
 * POST /api/tools/hash
 * Body: { text: string, algorithm: "md5" | "sha1" | "sha256" | "sha512" }
 * Returns the hash of the given text.
 */
router.post('/hash', (req, res) => {
  const { text, algorithm = 'sha256' } = req.body;
  if (typeof text !== 'string') {
    return res.status(400).json({ error: 'Field "text" (string) is required.' });
  }
  const supported = ['md5', 'sha1', 'sha256', 'sha512'];
  if (!supported.includes(algorithm)) {
    return res.status(400).json({ error: `Algorithm must be one of: ${supported.join(', ')}.` });
  }
  const hash = crypto.createHash(algorithm).update(text).digest('hex');
  return res.json({ algorithm, result: hash });
});

/**
 * GET /api/tools/uuid
 * Generates a new random UUID (v4).
 */
router.get('/uuid', (req, res) => {
  return res.json({ result: crypto.randomUUID() });
});

/**
 * POST /api/tools/text/wordcount
 * Body: { text: string }
 * Returns character, word, and line counts.
 */
router.post('/text/wordcount', (req, res) => {
  const { text } = req.body;
  if (typeof text !== 'string') {
    return res.status(400).json({ error: 'Field "text" (string) is required.' });
  }
  const characters = text.length;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const lines = text === '' ? 0 : text.split(/\r?\n/).length;
  return res.json({ characters, words, lines });
});

/**
 * POST /api/tools/text/reverse
 * Body: { text: string }
 * Reverses the given text.
 */
router.post('/text/reverse', (req, res) => {
  const { text } = req.body;
  if (typeof text !== 'string') {
    return res.status(400).json({ error: 'Field "text" (string) is required.' });
  }
  return res.json({ result: [...text].reverse().join('') });
});

/**
 * POST /api/tools/text/case
 * Body: { text: string, transform: "upper" | "lower" | "title" }
 * Transforms text case.
 */
router.post('/text/case', (req, res) => {
  const { text, transform } = req.body;
  if (typeof text !== 'string') {
    return res.status(400).json({ error: 'Field "text" (string) is required.' });
  }
  const supported = ['upper', 'lower', 'title'];
  if (!supported.includes(transform)) {
    return res.status(400).json({ error: `Transform must be one of: ${supported.join(', ')}.` });
  }
  let result;
  if (transform === 'upper') {
    result = text.toUpperCase();
  } else if (transform === 'lower') {
    result = text.toLowerCase();
  } else {
    result = text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  }
  return res.json({ result });
});

module.exports = router;
