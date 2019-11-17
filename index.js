/**
 * @module streamss-readonly
 * @copyright 2015 commenthol
 * @license MIT
 *
 * Code inspired by [read-only-stream](https://github.com/substack/read-only-stream) project. (MIT-licensed)
 */

'use strict'

const { Readable } = require('stream')
/**
 * Converts any stream into a read-only stream
 * @param {Readable|Transform|Duplex} stream - A stream which shall behave as a Readable only stream.
 * @throws {Error} "not a readable stream" - if stream does not implement a Readable component this error is thrown
 * @return {Readable} - A read-only readable stream
 */
function readonly (stream) {
  const rs = stream._readableState || {}
  const opts = {}

  if (typeof stream.read !== 'function') {
    throw new Error('not a readable stream')
  }

  ;['highWaterMark', 'encoding', 'objectMode'].forEach(p => {
    opts[p] = rs[p]
  })

  const readOnly = new Readable(opts)
  let waiting = false

  stream.on('readable', () => {
    if (waiting) {
      waiting = false
      readOnly._read()
    }
  })

  readOnly._read = function (size) {
    let buf

    while ((buf = stream.read(size)) !== null) {
      if (!readOnly.push(buf)) {
        return
      }
    }
    waiting = true
  }

  stream.once('end', () => {
    readOnly.push(null)
  })
  stream.once('close', () => {
    readOnly.emit('close')
  })
  stream.on('error', (err) => {
    readOnly.emit('error', err)
  })
  return readOnly
}

module.exports = readonly
