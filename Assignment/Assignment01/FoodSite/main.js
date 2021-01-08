var path = require("path");
var express = require("express");
var app = express();

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function (req, res) {
  res.send("Hello World<br /><a href='/about'>Go to the about page</a>");
});

// setup another route to listen on /about
app.get("/about", function (req, res) {
  //res.send("<h3>About</h3>");
  res.sendFile(path.join(__dirname, "/views/about.html"));
});

// setup another route to listen on /home
app.get("/home", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/home.html"));
});

// setup another route to listen on /mealsPackagePage
app.get("/mealsPackagePage", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/mealsPackagePage.html"));
});

// setup another route to listen on /customerRegistration
app.get("/customerRegistration", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/customerRegistration.html"));
});

// setup another route to listen on /login
app.get("/login", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/login.html"));
});

//app.use(express.static("css"));

var dir = path.join(__dirname, "/sources");
app.use(express.static(dir));



// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);
