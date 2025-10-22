// Simple static file server to serve the project without extra dependencies
// Usage: node server.js [port]

const http = require('http');
const fs = require('fs');
const path = require('path');

const port = parseInt(process.argv[2], 10) || 62146;
const root = process.cwd();

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.webm': 'video/webm',
  '.ogg': 'audio/ogg'
};

function send404(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('404 Not Found');
}

function send500(res, err) {
  res.statusCode = 500;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('500 Internal Server Error\n' + String(err));
}

const server = http.createServer((req, res) => {
  try {
    let reqPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
    if (reqPath === '/') {
      reqPath = '/index.html';
    }
    const fsPath = path.join(root, '.' + reqPath);

    // Prevent directory traversal
    if (!fsPath.startsWith(root)) {
      send404(res);
      return;
    }

    fs.stat(fsPath, (err, stats) => {
      if (err) {
        send404(res);
        return;
      }
      if (stats.isDirectory()) {
        // try index.html inside
        const indexFile = path.join(fsPath, 'index.html');
        fs.stat(indexFile, (ie, is) => {
          if (ie || !is.isFile()) {
            send404(res);
            return;
          }
          streamFile(indexFile, res);
        });
        return;
      }
      if (stats.isFile()) {
        streamFile(fsPath, res);
        return;
      }
      send404(res);
    });
  } catch (err) {
    send500(res, err);
  }
});

function streamFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const m = mime[ext] || 'application/octet-stream';
  res.statusCode = 200;
  res.setHeader('Content-Type', m);
  const stream = fs.createReadStream(filePath);
  stream.on('error', (err) => send500(res, err));
  stream.pipe(res);
}

server.listen(port, '0.0.0.0', () => {
  console.log(`Static server running at http://127.0.0.1:${port}/`);
  console.log(`Serving directory: ${root}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => process.exit(0));
});
