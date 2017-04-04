#!/usr/bin/env node
var _        = require('lodash') // Just use lodash omg!
var fs       = require('fs')
var chpro    = require('child_process')

var through  = require('through')
var csv = require('fast-csv')
var tmp      = require('tmp')
var duplexer = require('duplexer')
var concat   = require('concat-stream')

var spawn = chpro.spawn

module.exports = function (options) {

  var read = through()
  var duplex

  var file = tmp.fileSync({postfix: '.xlsx'})

  var spawnArgs = []

  if (options) {
    options.sheet && spawnArgs.push('--sheet') && spawnArgs.push(options.sheet) && delete options.sheet
    options.sheetIndex && spawnArgs.push('--sheet-index') && spawnArgs.push(options.sheetIndex) && delete options.sheetIndex
  }

  spawnArgs.push(file.name)

  var write = fs.createWriteStream(file.name)
    .on('close', function () {
      var child = spawn(require.resolve('j/bin/j.njs'), spawnArgs)
      child.stdout.pipe(csv(options))
        .pipe(through(function (data) {
          var empty = _(data).values().union().filter(Boolean).isEmpty()

          if (empty) return // Skip empty rows please

          var _data = {}
          for(var k in data) {
            var value = data[k].trim()
            _data[k.trim()] = (isNaN(value) || _.isEmpty(value)) ? value : _.toNumber(value);
          }
          this.queue(_data)
        }))
        .pipe(read)
      child.on('exit', function(code, sig) {
        // Ensure explicit removal of temp file
        if(file) file.removeCallback()
        if(code === null || code !== 0) {
          child.stderr.pipe(concat(function(errstr) {
            duplex.emit('error', new Error(errstr))
          }))
        }
      })
    })

  return (duplex = duplexer(write, read))

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
