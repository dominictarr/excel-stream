const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const MemoryStream = require('memorystream');
const excelStream = require('../index');
const memStream = MemoryStream.createWriteStream();

describe('ExcelStream', () => {
  it('should read excel file content', (done) => {
    fs.createReadStream(path.join(__dirname, 'test-data.xlsx'))
      .pipe(excelStream({ sheetIndex: 0 }))
      .on('data', (chunk) => memStream.write(`${chunk.toString()}\n`))
      .on('end', function() {
        expect(memStream.toString()).to.eql(
          'name,position,location,salary,,,\nBob,Striker,UK,100000,some notes,,\nJane Smith,goalkeeper,US,50000,,,\n');
        done();
      });
  });
});