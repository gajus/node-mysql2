var common     = require('../../common');
var connection = common.createConnection();
var assert     = require('assert');

connection.query('CREATE TEMPORARY TABLE t (f TIMESTAMP)');
connection.query('INSERT INTO t VALUES(\'2013-01-22 01:02:03\')');

var rows, fields;
var rows1, fields1;
var rows2, fields2;
connection.query('SELECT f FROM t', function(err, _rows, _fields) {
  if (err) throw err;
  rows = _rows;
  fields = _fields;
});
connection.execute('SELECT f FROM t', function(err, _rows, _fields) {
  if (err) throw err;
  rows1 = _rows;
  fields1 = _fields;
});

// test 11-byte timestamp - https://github.com/sidorares/node-mysql2/issues/254
connection.execute('SELECT CURRENT_TIMESTAMP(6) as t11', function(err, _rows, _fields) {
  if (err) throw err;
  rows2 = _rows;
  fields2 = _fields;
  connection.end();
});

process.on('exit', function() {
  assert(rows[0].f instanceof Date);
  assert.equal(rows[0].f.getYear(), 113);
  assert.equal(rows[0].f.getMonth(), 0);
  assert.equal(rows[0].f.getDate(), 22);
  assert.equal(rows[0].f.getHours(), 1);
  assert.equal(rows[0].f.getMinutes(), 2);
  assert.equal(rows[0].f.getSeconds(), 3);
  assert.equal(fields[0].name, 'f');
  assert.deepEqual(rows[1], rows1[1]);
  assert.deepEqual(fields[0].inspect(), fields1[0].inspect());

  assert(rows2[0].t11 instanceof Date);
});
