// Static server for dist/ that emulates GitHub Pages semantics:
// - /dir           -> dir/index.html (extensionless, no redirect needed to verify)
// - missing path   -> 404.html with status 404
// - *.gz sidecar   -> served with Content-Encoding: gzip when accepted
//   (GitHub Pages always serves gzip/brotli; serving plain files would report
//   inflated transfer sizes to Lighthouse and skew scores vs production).
// Usage: node scripts/serve-dist.mjs [port]
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const DIST = resolve('dist');
const PORT = Number(process.argv[2]) || 4173;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  let path = normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, '');
  let file = join(DIST, path);

  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  let status = 200;
  if (!existsSync(file) || statSync(file).isDirectory()) {
    file = join(DIST, '404.html');
    status = 404;
  }

  const gzip = req.headers['accept-encoding']?.includes('gzip') && existsSync(file + '.gz');
  const body = readFileSync(gzip ? file + '.gz' : file);
  res.writeHead(status, {
    'content-type': MIME[extname(file)] ?? 'application/octet-stream',
    ...(gzip ? { 'content-encoding': 'gzip' } : {}),
  });
  res.end(body);
}).listen(PORT, () => console.log(`serving dist on :${PORT}`));
