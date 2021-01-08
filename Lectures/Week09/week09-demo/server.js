/*******Step 1: Add the client-sessions library to the project. */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const clientSessions = require("client-sessions");  // Add the client-sessions library 

const HTTP_PORT = process.env.PORT || 8080;


/*******Step 2: Create a middleware function to setup client-sessions. */
// Register handlerbars as the rendering engine for views
app.engine(".hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");

// Setup the static folder that static resources can load from
// like images, css files, etc.
// app.use(express.static("static")); // not used in this project

// Setup client-sessions (= register clientSessions as a middleware)
app.use(clientSessions({
  cookieName: "session", // this is the object name that will be added to 'req'
  secret: "week10example_web322", // this should be a long un-guessable string.
  duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
  activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));


/*******Step 3: Write a login route handler */

// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}
  
// A simple user object, hardcoded for this example
const user = {
    username: "sampleuser",
    password: "samplepassword",
    email: "sampleuser@example.com"
};
  
// Setup a route on the 'root' of the url to redirect to /login
app.get("/", (req, res) => {
    res.redirect("/login");
});

// Display the login html page
app.get("/login", function(req, res) {
    res.render("login", { layout: false });
});
  
// The login route that adds the user to the session
app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if(username === "" || password === "") {
      // Render 'missing credentials'
      return res.render("login", { errorMsg: "Missing credentials.", layout: false });
    }
  
    // access database Users table retrieve the username and password 
    // by retrieving a user object based on the "username"


    // use sample "user" (declared above)
    if(username === user.username && password === user.password){
  
      // Add the user on the session and redirect them to the dashboard page.
      req.session.user = {
        username: user.username,
        email: user.email //,
        // role: user.role // admin, customer, dataEntry
      };
  
      res.redirect("/dashboard");
    } else {
      // render 'invalid username or password'
      res.render("login", { errorMsg: "invalid username or password!", layout: false});
    }
  });

// Log a user out by destroying their session
// and redirecting them to /login
app.get("/logout", function(req, res) {
    req.session.reset();
    res.redirect("/login");
});

// Step 4: Add a middleware function that checks for authorization

// An authenticated route that requires the user to be logged in.
// Notice the middleware 'ensureLogin' that comes before the function
// that renders the dashboard page
app.get("/dashboard", ensureLogin, (req, res) => {
  res.render("dashboard", {user: req.session.user, layout: false});
});

// This is a helper middleware function that checks if a user is logged in
// we can use it in any route that we want to protect against unauthenticated access.
// A more advanced version of this would include checks for authorization as well after
// checking if the user is authenticated
function ensureLogin(req, res, next) {
    if (!req.session.user) {
      res.redirect("/login");
    } else {
      next();
    }
  }
  
  
app.listen(HTTP_PORT, onHttpStart);
  