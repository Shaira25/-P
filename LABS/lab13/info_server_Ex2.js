var express = require('express');
var app = express();
var myParser = require("body-parser");

app.all('/*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true }));
app.post("/process_form", function (request, response) {
    let POST = request.body;

    q = POST['quantity_textbox'];

    if (typeof POST['quantity_textbox'] != 'undefined') {
        POST['quantity_textbox'].value = q;
        console.log(q);
    if (isNonNegInt(q, false)) {
        response.send(`Thank you for purchasing ${q} things!`);
     } 
    else {
        response.send(`${q} is not a quantity! Press the back button and try again.`);
        }
    };

    function isNonNegInt(q, return_errors = false) {
        errors = []; // assume no errors at first
        if (q =='') q = 0; // handle blank inputs as if they are 0
        if (q == 0) errors.push('<font color="red">Not a valid quantity!</font>') // Does not allow '0' items to be purchased
        if (Number(q) != q) errors.push('<font color="red">Not a number!</font>'); // Check if string is a number value
        if (q < 0) errors.push('<font color="red">Negative value!</font>'); // Check if it is non-negative
        if (parseInt(q) != q) errors.push('<font color="red">Not an integer!</font>'); // Check that it is an integer
        return return_errors ? errors : (errors.length == 0);
    }

});

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));