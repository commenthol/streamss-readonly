/**
 * @module streamss-readonly
 * @copyright 2015 commenthol
 * @license MIT
 *
 * Code inspired by [read-only-stream](https://github.com/substack/read-only-stream) project. (MIT-licensed)
 */

'use strict';

var Readable = require('streamss-shim').Readable;

/**
 * Converts any stream into a read-only stream
 * @param {Readable|Transform|Duplex} stream - A stream which shall behave as a Readable only stream.
 * @throws {Error} "not a readable stream" - if stream does not implement a Readable component this error is thrown
 * @return {Readable} - A read-only readable stream
 */
function readonly(stream) {
	var rs = stream._readableState || {};
	var opts = {};

	if (typeof stream.read !== 'function') {
		throw new Error('not a readable stream');
	}

	['highWaterMark','encoding','objectMode'].forEach(function(p){
		opts[p] = rs[p];
	});

	var readOnly = new Readable(opts);
	var waiting = false;

	stream.on('readable', function () {
		if (waiting) {
			waiting = false;
			readOnly._read();
		}
	});

	readOnly._read = function(size) {
		var buf;

		while ((buf = stream.read(size)) !== null) {
			if (! readOnly.push(buf) ) {
				return;
			}
		}
		waiting = true;
	};

	stream.once('end', function () {
		readOnly.push(null);
	});
	stream.on('close', function () {
		readOnly.emit('close');
	});
	stream.on('error', function (err) {
		readOnly.emit('error', err);
	});
	return readOnly;
}

module.exports = readonly;
