/**
 * @copyright 2015 commenthol
 * @license MIT
 */

'use strict';

var _ = require('underscore');
var Readable = require('streamss-shim').Readable;

/**
 * @credits
 * @see https://github.com/substack/read-only-stream
 */

/**
 * converts any stream into a read-only stream
 * @param {Stream}
 */
module.exports = function (stream) {
	var opts = _.pick(stream._readableState || {}, 'highWaterMark encoding objectMode'.split(' '));

	var readonly = new Readable(opts);
	var waiting = false;

	stream.on('readable', function () {
		if (waiting) {
			waiting = false;
			readonly._read();
		}
	});

	readonly._read = function(size) {
		var buf;

		while ((buf = stream.read(size)) !== null) {
			if (! readonly.push(buf) ) {
				return;
			}
		}
		waiting = true;
	};

	stream.once('end', function () {
		readonly.push(null);
	});
	stream.on('close', function () {
		readonly.emit('close');
	});
	stream.on('error', function (err) {
		readonly.emit('error', err);
	});
	return readonly;
};
