# excel-stream

A stream that converts excel spreadsheets into JSON object arrays.


# Examples

``` js
// stream rows from the first sheet on the file
var excel = require('excel-stream')
var fs = require('fs')

fs.createReadStream('accounts.xlsx')
  .pipe(excel())  // same as excel({sheetIndex: 0})
  .on('data', console.log)

```

``` js
// stream rows from the sheet named 'Your sheet name'
var excel = require('excel-stream')
var fs = require('fs')

fs.createReadStream('accounts.xlsx')
  .pipe(excel({
     sheet: 'Your sheet name'
  }))
  .on('data', console.log)

```

# stream options

The `options` object may have the same properties as [csv-stream](https://www.npmjs.com/package/csv-stream) and these two additional properties:

 * `sheet`: the name of the sheet you want to stream. Case sensitive.
 * `sheetIndex`: the sheet number you want to stream (0-based).

# Usage

``` js
npm install -g excel-stream
excel-stream < accounts.xlsx > account.json
```

# options

newline delimited json:

```js
excel-stream --newlines
```

# formats

each row becomes a javascript object, so input like

``` csv
foo, bar, baz
  1,   2,   3
  4,   5,   6
```

will become

``` js
[{
  foo: 1,
  bar: 2,
  baz: 3
}, {
  foo: 4,
  bar: 5,
  baz: 6
}]

```

# Don't Look Now

So, excel isn't really a streamable format.
But it's easy to work with streams because everything is a stream.
This writes to a tmp file, then pipes it through the unfortunately named [j](https://npm.im/j)
then into [csv-stream](https://npm.im/csv-stream)


## License

MIT
