export = readonly;
/**
 * Converts any stream into a read-only stream
 * @param {Readable|Transform|Duplex} stream - A stream which shall behave as a Readable only stream.
 * @throws {Error} "not a readable stream" - if stream does not implement a Readable component this error is thrown
 * @return {Readable} - A read-only readable stream
 */
declare function readonly(stream: any): any;
