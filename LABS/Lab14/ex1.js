var fs = require ('fs');
var filename = './user_data.json';

var data = fs.readFileSync (filename, 'utf-8');

data = JSON.parse (data);
console.log (data.kazman.password);