/* Assignment 2 by Shane Gimenez
Codes are from Professor Dan's Lab 13 exercises. And with guidance of Kiara Furutani */


var express = require('express');
var myParser = require("body-parser");
var fs = require('fs');
var data = require('./Public/product_data.js');
var products = data.products;
var productNames = data.productNames;
const queryString = require("querystring");
var filename = 'UserData.json';
var cookieParser = require('cookie-parser');
var session = require('express-session');

console.log(productNames);

var app = express();
app.use(myParser.urlencoded({ extended: true })); // Server-side processing
app.use(cookieParser());
app.use(session({secret: "it is secret and no one should know it!"}));

app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

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

// Referrence: https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript/25352300#25352300
// Function used to check for alphanumeric string
function isAlphaNumeric(str) {
    var len = str.length;

    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i); // the i-th character code

        if (!(c > 47 && c < 58) && // numeric (0-9)
        !(c > 64 && c < 91) && // upper alpha (A-Z)
        !(c > 96 && c < 123)) { // lower alpha (a-z)
            return false; // it is not an alphanumeric
        }
    }
    return true; // it is an alphanumeric
}

// Referrence: https://tylermcginnis.com/validate-email-address-javascript/
// Function used to validate email address
function ValidateEmail(str) 
{
    return /\S+@\S+\.\S+/.test(str);
}

// Function used to add new user account
function addUser(Username, Email, Password) {
    users_reg_data[Username] = {Email : Email, Password : Password};
    fs.writeFileSync(filename, JSON.stringify(users_reg_data));
}

// Function used to determine if the user is logged in
// Returns true when logged in, and false otherwise
function isLoggedIn(request) {
    if(typeof(request.session.loginUser) != 'undefined') {
        return true;
    } else {
        return false;
    }
}

// Returns the number of the product user selected.
function getNumOfSelectedProducts(request, productName) {
    return parseInt(request.cookies["num_" + productName]);
}

// Let the specified user logged in, saving it into session.
function acceptLogin(username, request) {
    var userInfo = users_reg_data[username];
    request.session.loginUser = {username : username, email : userInfo.Email};
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

app.get("/", function (request, response) {

    response.cookie("num_" + "classic_products", 0);
    response.cookie("num_" + "aloha_products", 0);
    response.cookie("num_" + "shy_products", 0);
    response.cookie("num_" + "travel_products", 0);
    response.redirect("./index.html");
});

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
// Processes login page
app.post("/doLogin", function (request, response) {
    console.log(request.body); // Checks in console
    var qString = queryString.stringify(request.query); // String query together
    // Assigns textbox inputs to values
    var the_username = request.body.username; // Assigns inputted username
    var the_password = request.body.password;
    var redirectTo = request.body.redirectTo;
    var resQuery = {};

    // Redirect to invoice page if true, else back to login page
    if (typeof users_reg_data[the_username] != 'undefined') { // Checks if username exists in user database
        if (users_reg_data[the_username].Password == request.body.password) { // If password matches with username in user database
            // save login status to session

            acceptLogin(the_username, request);
            response.redirect("./" + redirectTo);
            return;
        } else if (users_reg_data[the_username].password != request.body.password) { // Else if password does not match username in user database
            // Puts variables into query
            resQuery.redirectTo = redirectTo;
            resQuery.error = 'Incorrect Password';
            resQuery.stickUsername = the_username;
        }
    } else {
        // Puts variables into query
        resQuery.redirctTo = redirectTo;
        resQuery.error = 'Invalid Username';
        resQuery.stickUsername = the_username;
    }
    qString = queryString.stringify(resQuery); // String query together
    response.redirect("./logindisplay.html?" + qString); // Send back to login page with qString
});

app.post("/add_to_cart", function (request, response) {
    var productName = request.body.productName;
    var curQuantity = parseInt(request.cookies["num_" + productName]);
    var newQuantity = curQuantity + parseInt(request.body.quantity);
    response.cookie("num_" + productName, newQuantity);
    response.redirect("./" + request.body.redirectTo);
});


//The following code was taken from Lab 14 exercise 4
app.post("/register_user", function (request, response) {
    // process a simple register form
    var registered_username = request.body["Username"]; //set var registered_username to the username entered in registration page
    var error = "";

    //username 
    if (registered_username == '') { //must have a username
        error = error + 'Please enter a username.';
    } else if (registered_username.length < 4 || registered_username.length > 10) { // if username is not between 4 and 10 characters...
        error = error + 'Username must be between 4 & 10 characters.';
    } else if (isAlphaNumeric(registered_username) == false) { //if username is not only letters and numbers...
        error = error + 'Please only use alphanumeric characters.';
    } else if (typeof users_reg_data[registered_username] != "undefined") { //check if username already exists
        error = error + 'The username is already registered.';
    }

    //email
    var emailAddr = request.body.email;
    if (emailAddr == '') { //must have an email
        error = error + 'Please enter an email address.';
    } else if (ValidateEmail(emailAddr) == false) { //if does not follow proper email format, give error
        error = error + 'Please enter a valid email address.';
    }

    var pwd = request.body["psw"];
    var pwdRep = request.body["psw-repeat"];

    //password
    if (pwd.length == 0) { //must have a password
        error = error + 'Please enter a password.';
    } else if (pwd.length <= 5) { //must have a password at least 6 characters long
        error = error + 'Password must be at least 6 characters.';
    } else if (pwd != pwdRep) {//Check if password is same as the repeat password field
        error = error + 'Passwords do not match.';
    }

    if (error.length == 0) {
        addUser(registered_username, emailAddr, pwd, pwdRep);

        // Automatically let the registered user logged in.
        acceptLogin(registered_username, request);
        var redirectTo = request.body.redirectTo;
        response.redirect("./" + redirectTo);    
    } else {
        var resQuery = {};
        resQuery.redirectTo = request.body.redirectTo;
        resQuery.error = error;
        var queryStr = queryString.stringify(resQuery);
        response.redirect("./registration_display.html?" + queryStr); // Send back to login page with qString    
    }
});

app.post("/getLoginStatus", function(request, response) {

    var loginStatus = {};

    if(typeof(request.session.loginUser) != 'undefined') {
        var loginUser = request.session.loginUser;
        loginStatus.loginFlag = '1';
        loginStatus.username = loginUser.username;
        loginStatus.email = loginUser.email;
    } else {
        loginStatus.loginFlag = '0';
        loginStatus.username = '';
        loginStatus.email = '';
    }

    console.log(loginStatus);
    response.json(loginStatus);
});

app.post("/purchase", function(request, response) {

    if (!isLoggedIn(request)) {
        // If user is not logged in, page is redirected to login page.
        response.redirect('./logindisplay.html?redirectTo=cart.html');
    } else {
        // Send email to the user in prior to displaying the invoice page.

        // Redirect to the invoice page.
        var resQuery = {};
        console.log(productNames);
        for (var i = 0; i < productNames.length; i++) {
            productName = productNames[i];
            var num = getNumOfSelectedProducts(request, productName);

            if (num <= 0) {
                continue;
            }

            resQuery[productName] = num;
        }
        resQueryStr = queryString.stringify(resQuery);
        response.redirect('./ProductInvoice.html?' + resQueryStr);
    }
});

app.use(express.static('./public')); 
app.listen(8080, () => console.log(`listening on port 8080`)); 
