#!/usr/bin/env node

var fs         = require('fs')
var os         = require('os')
var path       = require('path')
var chpro      = require('child_process')
var duplexer   = require('duplexer')
var concat     = require('concat-stream')
var JSONStream = require('JSONStream')

var spawn = chpro.spawn
if (os.type() === 'Windows_NT') spawn = require('win-spawn')

module.exports = function (options) {
  var child = spawn(require.resolve('j/bin/j.njs'), ['-J', '-'])
  var read = child.stdout.pipe(JSONStream.parse('*'))

  child.on('exit', function(code, sig) {
    if(code === null || code !== 0) {
      child.stderr.pipe(concat(function(errstr) {
        duplex.emit('error', new Error(errstr))
      }))
    }
  })

  var duplex = duplexer(child.stdin, read)
  return duplex
}


if (!module.parent) {
  var args = require('minimist')(process.argv.slice(2))
  process.stdin
    .pipe(module.exports())
    .pipe(args.lines || args.newlines
      ? JSONStream.stringify('', '\n', '\n', 0)
      : JSONStream.stringify()
    )
    .pipe(process.stdout)
}
