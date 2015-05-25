var test = require('tape')
var excel = require('./')
var concat = require('concat-stream')

test('csv to json', function(t){
  var stream = excel()

  stream.pipe(concat(function(data){
    // for rounding differences
    data[0].a = data[0].a.toFixed(1)

    t.deepEqual(data, [{ a: '0.3', c: -2}, { a: 'a', b: 'b', c: 'c' }])
    t.end()
  }))

  stream.end('a,b,c\n0.3,,-2\na,b,c')
})
