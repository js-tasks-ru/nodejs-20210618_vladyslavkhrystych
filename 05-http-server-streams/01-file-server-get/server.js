const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  const isNestedPath = pathname.includes('/');

  if (isNestedPath) {
    res.statusCode = 400;
    res.end();
  }

  const fileStream = fs.createReadStream(filepath);

  fileStream.pipe(res);

  fileStream.on('error', () => {
    res.statusCode = 404;
    res.end();
  });

  fileStream.on('end', () => {
    res.end();
  });

  switch (req.method) {
    case 'GET':
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
