# backend

A Node.js/Express REST API backend for a tools website.

## Getting Started

```bash
npm install
npm start        # starts server on port 3000 (override with PORT env var)
npm test         # run all tests
```

## API Endpoints

### Health

| Method | Path      | Description        |
|--------|-----------|--------------------|
| GET    | /health   | Health check       |

### Base64

| Method | Path                      | Body              | Description           |
|--------|---------------------------|-------------------|-----------------------|
| POST   | /api/tools/base64/encode  | `{ text }`        | Encode text to Base64 |
| POST   | /api/tools/base64/decode  | `{ text }`        | Decode Base64 text    |

### URL Encode / Decode

| Method | Path                   | Body       | Description        |
|--------|------------------------|------------|--------------------|
| POST   | /api/tools/url/encode  | `{ text }` | URL-encode text    |
| POST   | /api/tools/url/decode  | `{ text }` | URL-decode text    |

### JSON

| Method | Path                    | Body       | Description                |
|--------|-------------------------|------------|----------------------------|
| POST   | /api/tools/json/format  | `{ json }` | Pretty-print a JSON string |
| POST   | /api/tools/json/minify  | `{ json }` | Minify a JSON string       |

### Hash

| Method | Path             | Body                           | Description                                    |
|--------|------------------|--------------------------------|------------------------------------------------|
| POST   | /api/tools/hash  | `{ text, algorithm? }`         | Hash text (md5, sha1, sha256, sha512; default: sha256) |

### UUID

| Method | Path             | Description         |
|--------|------------------|---------------------|
| GET    | /api/tools/uuid  | Generate a UUID v4  |

### Text Utilities

| Method | Path                      | Body                          | Description                            |
|--------|---------------------------|-------------------------------|----------------------------------------|
| POST   | /api/tools/text/wordcount | `{ text }`                    | Count characters, words, and lines     |
| POST   | /api/tools/text/reverse   | `{ text }`                    | Reverse text                           |
| POST   | /api/tools/text/case      | `{ text, transform }`         | Change case (upper, lower, title)      |
