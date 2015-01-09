# streamss-readonly

> Make streams2 read-only

[![NPM version](https://badge.fury.io/js/streamss-readonly.svg)](https://www.npmjs.com/package/streamss-readonly/)
[![Build Status](https://secure.travis-ci.org/commenthol/streamss-readonly.svg?branch=master)](https://travis-ci.org/commenthol/streamss-readonly)

Wraps any kind of stream to behave like a [Readable][] Stream. This is a pure Stream2 implementation which respects `highWaterMark` and saturation of piped streams.

Works with node v0.8.x and greater.
For node v0.8.x the user-land copy [readable-stream][] is used.
For all other node versions greater v0.8.x the built-in `stream` module is used.

Credits go to [read-only-stream][].

### Example

``` javascript
var through = require('streamss').Through;
var readonly = require('streamss-readonly');

var th = through();
var ro = readonly(th);

ro.pipe(process.stdout);
th.write('hello world');

//ro.write('this throws');
```

## Methods

### readonly(stream)

> Converts any stream into a read-only stream

**Parameters:**

- `{Readable | Transform | Duplex} stream` - A stream which shall behave as a Readable only stream.

**Return:**

`{Readable}` - A read-only readable stream

**Throws:**

- `{Error}` "not a readable stream" - if stream does not implement a Readable component this error is thrown


## Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your
code to be distributed under the MIT license. You are also implicitly
verifying that all code is your original work or correctly attributed
with the source of its origin and licence.

### npm scripts

* `npm test`      - Run tests
* `npm run cover` - Run istanbul code coverage (shows code coverage; open ./coverage/lcov-report/index.html after run)
* `npm run lint`  - Linting the source
* `npm run doc`   - Generate documentation from source (open ./doc/index.html after run)

## License

Copyright (c) 2015 commenthol (MIT License)

See [LICENSE][] for more info.

[LICENSE]: ./LICENSE
[read-only-stream]: https://github.com/substack/read-only-stream
[Readable]: http://nodejs.org/api/stream.html#stream_class_stream_readable
[readable-stream]: https://github.com/isaacs/readable-stream



