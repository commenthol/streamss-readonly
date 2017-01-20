/**
 * @copyright 2015 commenthol
 * @license MIT
 */

'use strict'

var assert = require('assert')
var Through = require('streamss').Through
var ReadBuffer = require('streamss').ReadBuffer
var ReadArray = require('streamss').ReadArray
var WriteArray = require('streamss').WriteArray
var readonly = require('../index')

/* globals describe, it */

describe('#readonly', function () {
  var abc = 'abcdefghi'

  it('does not pass write', function () {
    var stream = new Through()
    var ro = readonly(stream)

    assert.throws(function () {
      ro.write('no write here')
    })

    stream.end()
  })

  it('allows write', function (done) {
    var stream = new Through()
    var ro = readonly(stream)

    stream.write(abc)

    ro.pipe(new Through(function (data) {
      assert.equal(data, abc)
      done()
    }))

    stream.end()
  })

  it('Writable stream throws', function () {
    var stream = new WriteArray()
    assert.throws(function () {
      readonly(stream)
    })
  })

  it('passes on stream', function (done) {
    var stream = new ReadBuffer(abc)
    var ro = readonly(stream)
    var exp = []
    exp.push(new Buffer(abc))

    ro.pipe(new WriteArray({ highWaterMark: 3, decodeStrings: false }, function (err, arr) {
      assert.strictEqual(err, null)
      assert.deepEqual(arr, exp)
      done()
    }))
  })

  it('passes on stream and respects highWaterMark', function (done) {
    var stream = new ReadBuffer({ highWaterMark: 3, encoding: 'utf8' }, abc)
    var ro = readonly(stream)
    var exp = [ 'abc', 'def', 'ghi' ]

    ro.pipe(new WriteArray({ decodeStrings: false }, function (err, arr) {
      assert.strictEqual(err, null)
      assert.deepEqual(arr, exp)
      done()
    }))
  })

  it('passes on object stream', function (done) {
    var exp = [ 'abc', 'def', 'ghi' ]
    var stream = ReadArray.obj(exp.slice())
    var ro = readonly(stream)

    ro.pipe(WriteArray.obj(function (err, arr) {
      assert.strictEqual(err, null)
      assert.deepEqual(arr, exp)
      done()
    }))
  })

  it('emits close', function (done) {
    var stream = new Through()
    var ro = readonly(stream)

    ro.on('close', function () {
      done()
    })

    stream.emit('close')
  })

  it('emits error', function (done) {
    var stream = new Through()
    var ro = readonly(stream)

    ro.on('error', function (err) {
      assert.ok(err !== null)
      assert.equal(err.message, 'Bang!')
      done()
    })

    stream.emit('error', new Error('Bang!'))
  })
})
