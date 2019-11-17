const { Through } = require('streamss')
const readonly = require('../')

const th = Through()
const ro = readonly(th)

ro.pipe(process.stdout)
th.write('hello world\n')
th.end()

// ro.end('this throws');
