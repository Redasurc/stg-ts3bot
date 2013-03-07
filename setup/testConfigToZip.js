var node_zip = require('node-zip');
var fs = require('fs');

var zip = new node_zip();
zip.file('test.txt', 'hello there');
var data = zip.generate({base64: false, compression: 'DEFLATE'});
fs.writeFile('test.zip', data, 'binary');



