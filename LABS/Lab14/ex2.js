var fs = require ('fs');
var filename = './user_data.json';

if (fs.existsSync(user_info_file)){
var data = fs.readFileSync (filename, 'utf-8');

data = JSON.parse (data);
console.log (data.kazman.password);
}

else {
      console.log( "hi! "+ user_info_file+ "!exist"}