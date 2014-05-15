#! /usr/bin/env node

var fs       = require('fs')
var path     = require('path')
var spawn    = require('child_process').spawn

var through  = require('through')
var csv      = require('csv-stream')
var osenv    = require('osenv')
var duplexer = require('duplexer')

module.exports = function () {

  var read = through()

  var filename = path.join(osenv.tmpdir(), '_'+Date.now())
  var write = fs.createWriteStream(filename)
    .on('close', function () {
      var child = spawn(require.resolve('j/bin/j.njs'), [filename])
      child.stdout.pipe(csv.createStream())
        .pipe(through(function (data) {
          for(var k in data)
            if(!k) delete data[k]
          this.queue(data)
        }))
        .pipe(read)
    })

  return duplexer(write, read)

}


if(!module.parent) {
  var JSONStream = require('JSONStream')

  process.stdin
    .pipe(module.exports())
    .pipe(JSONStream.stringify())
    .pipe(process.stdout)
}
