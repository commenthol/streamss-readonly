var through = require('streamss').Through;
var readonly = require('../');

var th = through();
var ro = readonly(th);

ro.pipe(process.stdout);
th.write('hello world\n');
th.end();

//ro.end('this throws');
