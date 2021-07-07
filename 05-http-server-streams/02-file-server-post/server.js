const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  const isNestedPath = pathname.includes('/') || pathname.includes('\\');
  if (isNestedPath) {
    res.statusCode = 400;
    res.end('Nested pathes are not supported');

    return;
  }

  const isFileAlreadyExists = fs.existsSync(filepath);

  if (isFileAlreadyExists) {
    res.statusCode = 409;
    res.end('File with this name already exist');

    return;
  }

  const oneMegabyteInBytes = 1048576;
  const writeFileStream = fs.createWriteStream(filepath);
  const streamWithLimit = new LimitSizeStream({
    limit: oneMegabyteInBytes,
  });

  const streamWithLimitErrorCb = () => {
    fs.unlinkSync(filepath);

    res.statusCode = 413;
    res.end('Maximum file size is 1mb');
  };

  const onRequestAbortedCb = () => {
    writeFileStream.destroy();
    fs.unlinkSync(filepath);
  };

  const onStreamFinishCb = () => {
    res.statusCode = 201;
    res.end('Success! File was created');
  }

  req.on('aborted', onRequestAbortedCb);

  req
    .pipe(streamWithLimit)
    .on('error', streamWithLimitErrorCb)
    .pipe(writeFileStream)
    .on('finish', onStreamFinishCb);

  switch (req.method) {
    case 'POST':
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;