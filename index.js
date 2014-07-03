#!/usr/bin/env node

var fs       = require('fs')
var os       = require('os')
var path     = require('path')
var chpro    = require('child_process')

var through  = require('through')
var csv      = require('csv-stream')
var osenv    = require('osenv')
var duplexer = require('duplexer')

var spawn = chpro.spawn
if (os.type() === 'Windows_NT') spawn = require('win-spawn')

module.exports = function () {

  var read = through()

  var filename = path.join(osenv.tmpdir(), '_'+Date.now())
  var write = fs.createWriteStream(filename)
    .on('close', function () {
      var child = spawn(require.resolve('j/bin/j.njs'), [filename])
      child.stdout.pipe(csv.createStream())
        .pipe(through(function (data) {
          var _data = {}
          for(var k in data) {
            var value = data[k].trim()
            _data[k.trim()] = isNaN(value) ? value : +value
          }
          this.queue(_data)
        }))
        .pipe(read)
    })

  return duplexer(write, read)

}


if(!module.parent) {
  var JSONStream = require('JSONStream')
  var args = require('minimist')(process.argv.slice(2))
  process.stdin
    .pipe(module.exports())
    .pipe(args.lines || args.newlines
      ? JSONStream.stringify('', '\n', '\n', 0)
      : JSONStream.stringify()
    )
    .pipe(process.stdout)
}
