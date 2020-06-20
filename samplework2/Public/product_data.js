//Assignment 3 by Shane Gimeenez and Marc Masaoay//
//codes are from lab 13 exercise 3//
//Images are own by me (Shane Gimenez)//

var productNames = ["classic_products", "aloha_products", "shy_products", "travel_products"];

var products = {

"classic_products" :
    {
        // Product 1
        "Facemask": "Classic",
        "price": 10,
        "price": 7,
        "image": "./images/1.jpg"
    },
"aloha_products" :
    {
        // Product 2
        "Facemask": "Aloha",
        "price": 15,
        "image": "./images/2.jpg"
    },
"shy_products" :
    {
        // Product 3
        "Facemask": "Shy Gray",
        "price": 15,
        "image": "./images/3.jpg"
    },
"travel_products" :
    {
        // Product 4
        "Facemask": "Travel Blue",
        "price": 15,
        "image": "./images/4.jpg"
    },
};

if (typeof(exports) == 'undefined') {
    var exports = {};
}

exports.products = products;
exports.productNames = productNames;




