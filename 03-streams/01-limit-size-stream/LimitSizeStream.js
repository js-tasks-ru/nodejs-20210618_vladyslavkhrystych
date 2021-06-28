const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    
    this.limit = options.limit;
    this.streamSize = 0;
  }

  _transform(chunk, _, callback) {
    this.streamSize += chunk.length;

    if (this.streamSize > this.limit) {
      callback(new LimitExceededError());
    } else {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
