const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this._encoding = options.encoding;
    this._tempPartWithoutEOL = '';
  }

  putPartWithEOLToStream(lines) {
    const firstLine = lines[0];
    const isLastElHasEOL = firstLine.slice(-1) === os.EOL;

    this.push(this._tempPartWithoutEOL + firstLine);
    this._tempPartWithoutEOL = '';

    const linesFiltered = lines.filter((_, index) => index !== 0);

    if (linesFiltered.length === 1 && !isLastElHasEOL) {
      this._tempPartWithoutEOL = linesFiltered[linesFiltered.length - 1];
    } else if (linesFiltered.length) {
      this.putPartWithEOLToStream(linesFiltered);
    }
  }

  _transform(chunk, _, callback) {
    const chunkStr = chunk.toString(this._encoding);

    if (chunkStr.includes(os.EOL)) {
      const lines = chunkStr.split(os.EOL);

      this.putPartWithEOLToStream(lines);
    } else {
      this._tempPartWithoutEOL += chunkStr;
    }

    callback();
  }

  _flush(callback) {
    if (this._tempPartWithoutEOL) {
      this.push(this._tempPartWithoutEOL);
    }

    callback();
  }
}

module.exports = LineSplitStream;
