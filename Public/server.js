/* Assignment 2 by Shane Gimenez
Codes are from Professor Dan's Lab 13 exercises. And with guidance of Kiara Furutani */


var express = require('express');
var myParser = require("body-parser");
var fs = require('fs');
var data = require('./public/product_data.js');
var products = data.products;
const queryString = require("querystring");
var filename = 'UserData.json';

var app = express();
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true })); // Server-side processing

// Taken from Lab 14
// Function used to check for valid quantities
function isNonNegInt(q, returnErrors = false) {
    error = ''; //  assume no errors at first
    if (q == "") q = 0; //  Adds a 0 if no values are added
    if (Number(q) != q) error = 'Not a number!'; //  Check if string is a number value
    if (q < 0) error = 'Negative value!'; //  Check if it is non-negative
    if (parseInt(q) != q) error = 'Not an integer!'; //  Check that it is an integer
    return returnErrors ? error : (error.length == 0); //  Returns any errors
}

// Taken from Lab 14
// Checks if JSON string already exists
if (fs.existsSync(filename)) {
    userid = fs.readFileSync(filename, 'utf-8');

    users_reg_data = JSON.parse(userid); //  Takes a string and converts it into object or array

    console.log(users_reg_data);
} else {
    console.log(filename + ' does not exist!');
}

// Taken from Lab 14
// Processes products page
app.post("/process_form", function (request, response) {
    let POST = request.body;
    console.log(POST); // Checks in console
    var hasValidQuantities = true; // Defines hasValidQuantities as true from the start
    var hasPurchases = false; // Defines hasPurhchases as false from the start
    for (i = 0; i < products.length; i++) { // For loop to check each quantity 
        q = POST[`quantity${i}`]; // Defines q as each variable in the array
        if (isNonNegInt(q) == false) { // If the quantity is an invalid integer
            hasValidQuantities = false; // hasValidQuantities is false
        }
        if (q > 0) { // If quantity enter is greater than 0
            hasPurchases = true; // hasPurchases is true
        }
    }
    // If data is valid give user an invoice, if not give them an error
    var qString = queryString.stringify(POST); // Strings query together
    console.log(qString); // Checks in console
    if (hasValidQuantities == true && hasPurchases == true) { // If both are valid
        response.redirect('./logindisplay.html?' + qString); // Send to login page with query
    }
    else {
        response.redirect("./ProductsDisplay.html?" + qString); // Send back to products page with query
    }
});

// Taken from Lab 14
// Post sourced from Shane Shimizu
// Processes login page
app.post("/login_form", function (request, response) {
    console.log(request.body); // Checks in console
    var qString = queryString.stringify(request.query); // String query together
    // Assigns textbox inputs to values
    inputUser = request.body.username;
    inputPass = request.body.password;
    the_username = request.body.username.toLowerCase(); // Assigns inputted username and is case-insensitive

    // Redirect to invoice page if true, else back to login page
    if (typeof users_reg_data[the_username] != 'undefined') { // Checks if username exists in user database
        if (users_reg_data[the_username].password == request.body.password) { // If password matches with username in user database
            // Assigns the username, email into variables
            loginEmail = users_reg_data[the_username].email;
            loginUserName = request.body.username;
            // Puts variables into query
            request.query.stickEmail = loginEmail;
            request.query.stickUsername = loginUserName;
            qString = queryString.stringify(request.query); // Strings query together
            response.redirect("./ProductInvoice.html?" + qString); // Send to invoice page with query   
        } else if (users_reg_data[the_username].password != request.body.password) { // Else if password does not match username in user database
            error = '<font color="red">Incorrect Password</font>'; // Assigns error to html to be displayed
            stickInput = inputUser; // Assigns inputted username to a sticky variable
            // Puts variables into query
            request.query.LoginError = error;
            request.query.logStickInput = stickInput;
        }
    } else {
        error = "<font color='red'>Invalid Username: </font>" + the_username; // Assigns error to html to be displayed
        stickInput = inputUser; // Assigns inputted username to a sticky variable
        // Puts variables into query
        request.query.LoginError = error;
        request.query.logStickInput = stickInput;
    }
    qString = queryString.stringify(request.query); // String query together
    response.redirect("./logindisplay.html?" + qString); // Send back to login page with qString
});


//The following code was taken from Lab 14 exercise 4
app.post("/register_user", function (request, response) {
    // process a simple register form
    errs = {}; //assume no errors at first
    var registered_username = request.body["username"]; //set var registered_username to the username entered in registration page

    //username 
    if (registered_username == '') { //must have a username
        errs.username = '<font color="red">Please Enter A Username</font>';
    } else if (registered_username.length < 4 || registered_username.length > 10) { // if username is not between 4 and 10 characters...
        errs.username = '<font color="red">Username Must Be Between 4 & 10 Characters</font>'; //error message
    } else if (isAlphaNumeric(registered_username) == false) { //if username is not only letters and numbers...
        errs.username = '<font color="red">Please Only Use Alphanumeric Characters</font>'; //give error message
    } else if (typeof userdata[registered_username] != "undefined") { //check if username already exists
        errs.username = '<font color="red">Username Taken</font>'; //return error message if username is taken
    } else {
        errs.username = null;
    }

      //email
      if (request.body.email == '') { //must have an email
        errs.email = '<font color="red">Please Enter An Email Address</font>';
    } else if (ValidateEmail(request.body.email) == false) { //if does not follow proper email format, give error
        errs.email = '<font color="red">Please Enter A Valid Email Address</font>';
    } else {
        errs.email = null;
    }

    //password
    if (request.body.password.length == 0) { //must have a password
        errs.password = '<font color="red">Please Enter A Password</font>';
    } else if (request.body.password.length <= 5) { //must have a password at least 6 characters long
        errs.password = '<font color="red">Password Must Be At Least 6 Characters</font>';
    } else if (request["body"]["password"] != request["body"]["repeat_password"]) {//Check if password is same as the repeat password field
        errs.password = null;
        errs.repeat_password = '<font color="red">Passwords Do Not Match</font>'; // let user know if passwords do not match
    } else {
        delete errs.password;
        errs.repeat_password = null;
    }

});

app.use(express.static('./public')); 
app.listen(8080, () => console.log(`listening on port 8080`)); 


