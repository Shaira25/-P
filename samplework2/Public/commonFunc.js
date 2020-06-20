var queryParams = (new URL(document.location)).searchParams;
var loginStatus;

function loadJSON(service, callback) {
    var xobj = new XMLHttpRequest();

    xobj.overrideMimeType("application/json");

    xobj.open('POST', service, false);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };

    xobj.send(null);
}

loadJSON('getLoginStatus', function (res) {
  loginStatus = JSON.parse(res);
});

function addHeader(headerOption) {

    // begin header
    document.write(`<div class="header">`);

    if (headerOption.logo) {
        document.write(`<a class="logo">Sha'zey's design!</a>`);
    }

    // begin header-right
    document.write(`<div class="header-right">`);

    if (headerOption.home) {
        document.write(`<a class="active" href="./index.html">Home</a>`);
    }

    if (headerOption.viewCart) {
        document.write(`<a href="./cart.html">View Cart</a>`);
    }

    if (headerOption.loginRegister) {
        document.write(`<a href="#" onclick="document.toLogin.submit();">Login/Register</a>`);
    }

    if (loginStatus.loginFlag == '1') {
        document.write(`
          <a href="#">` + loginStatus.username + `</a>
          <a href="./"logout.html">Logout</a>
        `);
    }

    document.write(`</div>`);
    // end header-right

    var redirectTo;
    if (typeof (headerOption.redirectTo) != 'undefined') {
        redirectTo = headerOption.redirectTo;
    } else {
        redirectTo = 'index.html';
    }
    document.write(`
        <div style="display:none">
            <form name="toLogin" action="/logindisplay.html" method="GET">
                <input type="hidden" name="redirectTo" value="` + redirectTo + `">
            </form>
        </div>`
    );

    document.write(`</div>`);
    // end header
}
