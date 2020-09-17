var fs = require('fs');
var user_info_file = './user_data.json';
var express = require('express');
var app = express();
var myParser = require("body-parser");


if (fs.existsSync(user_info_file)) { //use existsSync means it waits until this path is verified before executing other code (Sync implies waiting)
    var file_stats = fs.statSync(user_info_file);

    var userdata = fs.readFileSync(user_info_file, 'utf-8'); //open file user_data.json and assigns it (in a string) to variable data
    userdata = JSON.parse(userdata); //json parse will convert string into json object
    username = 'newuser';
    userdata[username] = {};
    userdata[username].password = 'newpass';
    userdata[username].email = 'newuser@user.com';
    userdata[username].name = 'The New Guy'; 

    console.log(userdata["newuser"]["password"]); 
    fs.writeFileSync(user_info_file, JSON.stringify(userdata));//now it is a JSON object

    console.log(`${user_info_file} has ${file_stats.size} characters`);
} else {
    console.log("hey! " + user_info_file + " doesn't exist!");
}

app.use(myParser.urlencoded({ extended: true }));

app.get("/register", function (request, response) {
    // Give a simple register form
    str = `
<body>
<form action="/register_user" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
<input type="email" name="email" size="40" placeholder="enter email"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
 });

 app.post("/register_user", function (request, response) {
    // process a simple register form
    console.log(request.body);
    username = request.body.username;
    errs = [];
    //check if username is taken
    if(typeof userdata[username] != 'undefined') {
        errs.push("username taken");
    } else {
        userdata[username] = {};
    }
    //Check if password is same as the repeat password field
    if(request["body"]["password"] != request["body"]["repeat_password"]) {
        errs.push("passwords don't match");
    } else {
        userdata[username].password = request["body"]["password"];
    }

    userdata[username] ={};
    userdata[username].password = request.body.password;
    userdata[username].email = request.body.email

    if(errs.length == 0) {
        fs.writeFileSync(user_info_file, JSON.stringify(userdata));
        response.end(`New user ${username} registered`);
    } else {
        response.end(JSON.stringify(errs));
    }
 });
 
app.listen(8080, () => console.log(`listening on port 8080`));