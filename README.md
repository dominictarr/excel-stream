# excel-stream

A stream that converts excel spreadsheets into JSON object arrays.

# Example

``` js
var excel = require('excel-stream')
var fs = require('fs')

fs.createReadStream('accounts.xlsx')
  .pipe(excel())
  .on('data', console.log)

```

# Usage

``` js
npm install -g excel-stream
excel-stream < accounts.xlsx > account.json
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
