/* Assignment 2 by Shane Gimenez
Codes are from Professor Dan's Lab 13 exercises. And with guidance of Kiara Furutani */

var express = require('express'); //Calls the express package
var myParser = require("body-parser"); //Calls the package-lock.json
var fs = require('fs');
var data = require('./public/product_data.js'); //Pulls Product Data
var products = data.products;
var queryString = require("querystring");

var app = express(); //declaring express() as app
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});
app.use(myParser.urlencoded({ extended: true })); //Server-side processing
app.post("/process_form", function (request, response) {
    process_quantity_form(request.body, response);
});

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on Shane's 8080`));

function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0);
}

function process_quantity_form(POST, response) {
    if (typeof POST['purchase_submit_button'] != 'undefined') {
        // Check if the quantities are valid, if so, send to the invoice, if not, give an error
        var qString = queryString.stringify(POST);
        for (i in products) {
            let q = POST[`quantity${i}`];
            if (isNonNegInt(q) == true) {
                response.redirect('logindisplay.html?' + qString); // Redirects to Invoice with query strings
            } else {
                response.redirect('ProductsDisplay.html?' + qString); // Redirects back to Products page
            }
        }
    }
}