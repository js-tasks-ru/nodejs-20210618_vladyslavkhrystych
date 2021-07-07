const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  const isFileExists = fs.existsSync(filepath);
  const isNestedPath = pathname.includes('/') || pathname.includes('\\');

  if (isNestedPath) {
    res.statusCode = 400;
    res.end('Nested pathes are not supported');

    return;
  }

  if (!isFileExists) {
    res.statusCode = 404;
    res.end('Cannot find file with this name');

    return;
  }

  fs.unlinkSync(filepath);
  res.statusCode = 200;
  res.end('Success! File was deleted');

  switch (req.method) {
    case 'DELETE':

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
