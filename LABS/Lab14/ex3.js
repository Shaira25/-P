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

app.get("/login", function (request, response) { //get to login page
    // Give a simple login form
    str = `
<body>
<form action="/check_login?quantity=999" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
});

app.post("/check_login", function (request, response) {
    // Process login form POST and redirect to logged in page if information in login page matches that in the login JSON file, back to login page if not
    console.log(request.query);
    var err_str = "";
    var login_username = request.body["username"];
    //check if username exists in reg data. if so, check if password matches
    if (typeof userdata[login_username] != 'undefined') {
        var user_info = userdata[login_username];
        if (user_info.password != request.body["password"]) {//check if passowrd stored for username matches what user entered
            err_str = `bad_password`;
        } else {
        response.end(`${login_username} is logged in with data ${JSON.stringify(request.query)}`); //change this to response.redirect for assignment 2
        return; 
    } 
} else {
        err_str = `bad_username`;
}
response.redirect('./login?username}=${login_username}&error=%{err_str}');
});
 
app.listen(8080, () => console.log(`listening on port 8080`));