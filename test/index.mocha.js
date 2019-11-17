/**
 * @copyright 2015 commenthol
 * @license MIT
 */

'use strict'

const assert = require('assert')
const { through, ReadBuffer, ReadArray, WriteArray } = require('streamss')
const readonly = require('../index')

describe('#readonly', function () {
  const abc = 'abcdefghi'

  it('does not pass write', function () {
    const stream = through()
    const ro = readonly(stream)

    assert.throws(function () {
      ro.write('no write here')
    })

    stream.end()
  })

  it('allows write', function (done) {
    const stream = through()
    const ro = readonly(stream)

    stream.write(abc)

    ro.pipe(through(function (data) {
      assert.strictEqual(data.toString(), abc)
      done()
    }))

    stream.end()
  })

  it('Writable stream throws', function () {
    const stream = new WriteArray()
    assert.throws(function () {
      readonly(stream)
    })
  })

  it('passes on stream', function (done) {
    const stream = new ReadBuffer(abc)
    const ro = readonly(stream)
    const exp = []
    exp.push(Buffer.from(abc))

    ro.pipe(new WriteArray({ highWaterMark: 3, decodeStrings: false }, function (err, arr) {
      assert.strictEqual(err, null)
      assert.deepStrictEqual(arr, exp)
      done()
    }))
  })

  it('passes on stream and respects highWaterMark', function (done) {
    const stream = new ReadBuffer({ highWaterMark: 3, encoding: 'utf8' }, abc)
    const ro = readonly(stream)
    const exp = ['abc', 'def', 'ghi']

    ro.pipe(new WriteArray({ decodeStrings: false }, function (err, arr) {
      assert.strictEqual(err, null)
      assert.deepStrictEqual(arr, exp)
      done()
    }))
  })

  it('passes on object stream', function (done) {
    const exp = ['abc', 'def', 'ghi']
    const stream = ReadArray.readArrayObj(exp.slice())
    const ro = readonly(stream)

    ro.pipe(WriteArray.writeArrayObj(function (err, arr) {
      assert.strictEqual(err, null)
      assert.deepStrictEqual(arr, exp)
      done()
    }))
  })

  it('emits close', function (done) {
    const stream = through()
    const ro = readonly(stream)

    ro.on('close', function () {
      done()
    })

    stream.emit('close')
  })

  it('emits error', function (done) {
    const stream = through()
    const ro = readonly(stream)

    ro.on('error', function (err) {
      assert.ok(err !== null)
      assert.strictEqual(err.message, 'Bang!')
      done()
    })

    stream.emit('error', new Error('Bang!'))
  })
})
