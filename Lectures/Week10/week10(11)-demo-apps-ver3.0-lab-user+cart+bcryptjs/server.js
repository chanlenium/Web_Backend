/*********************************************************************************
 * *  WEB322 –Assignment 03-05
 * *  I declare that this assignment is my own work in accordance with Seneca  
 * Academic Policy.  No part *  of this assignment has been copied manually or 
 * electronically from any other source *  (including 3rd party web sites) or
 * distributed to other students.
 * * *  Name: ______________________ Student ID: ________________ Date: __________________
 * **  Online (Heroku, https://...) Link: ___________________________________________________
 * 
 * *********************************************************************************/


/*******Step 1: Add the client-sessions library to the project. */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const clientSessions = require("client-sessions");

const HTTP_PORT = process.env.PORT || 8080;

require('dotenv').config(); // for reaging the .env file

// const connectionString = config.database_connection_string;
const connectionString = process.env.MONGODB_CONN_STR;

const data_service = require("./data-service.js");
const dataService = data_service(connectionString);

const validation = require("./validation.js");

/*******Step 2: Create a middleware function to setup client-sessions. */
// Register handlerbars as the rendering engine for views
app.engine(".hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");

// Setup the static folder that static resources can load from
// like images, css files, etc.
app.use(express.static("static"));

// Setup client-sessions
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

    dataService.login(req.body)
       .then(msg => console.log("message in server.js' dataService.login(): ", msg))
       .catch(err => console.log("Errors in server.js' dataService.login(): ", err));

    // use sample "user" (declared above)
    if(username === user.username && password === user.password){
  
      // Add the user on the session and redirect them to the dashboard page.
      req.session.user = {
        username: user.username
        ,email: user.email 
        ,role: "customer" // "admin", "customer", "dataEntry"
        // ,role: "dataEntry" 
      };  

      // set up shopping cart for customer only
      if(req.session.user.role && req.session.user.role=="customer") {
        req.session.user.cart = { items: [], total: 0 }
      }
  
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

// define a route to show a page with Bootstrap and a form that has no file upload
app.get("/form-validation",  (req, res) => {
  res.render('form-validation', {
      data: { }
      ,layout: false // do not use the default Layout (main.hbs)
  });
});

app.post("/form-validation",  (req, res) => {
  var formData = req.body;
  var errors = validation.validateUserForm(formData)

  if (!errors.isValid) {
      res.render('form-validation', {
          data: {"formData": formData, "errors": errors}
      ,layout: false // do not use the default Layout (main.hbs)
      });
   
  } else {
      dataService.addUser(req.body)
      .then(data => {
        res.send("User " + data + " was registered.");
      })
      .catch(err => {
        res.send("Not registered, error: " + err);
      });
  }
});

app.get("/companies", (req, res) => { // from week 8 lab example
  dataService.getAllCompanies().then((companiesData)=>{
    console.log("companiesData", companiesData);
    // res.json(companiesData);
    
    res.render('companies', {
      data: companiesData,
      layout: false // do not use the default Layout (main.hbs)
    }); 
  })
  .catch((err)=>{
      res.status(500).end();
  })
  
});

// Create User - register
app.get("/add-user", (req, res) => {
  // send the html view with our form to the client
  res.render("add-user", { 
    layout: false // do not use the default Layout (main.hbs)
  });
});

app.post("/add-user",  (req, res) => {
  var newUser = req.body; // must install and use "body-parser" middleware to parse req.body 
  // newUser.role = "custmer";
  
  dataService.addUser(newUser)
    .then(data => {
      res.send("User " + data + " was registered.");
    })
    .catch(err => {
      res.send("Not registered, error: " + err);
    });
});

// An authenticated route that requires the user to be logged in.
// Notice the middleware 'ensureLogin' that comes before the function
// that renders the dashboard page
app.get("/dashboard", ensureLogin, (req, res) => {
  res.render("dashboard", {user: req.session.user, layout: false});
});


app.get("/cart-items", ensureCustomer, (req, res) => {
  res.render("cart-items", {user: req.session.user, layout: false});
});

app.get("/data-entry", ensureClerk, (req, res) => {
  res.render("data-entry", {user: req.session.user, layout: false});
});

// app.post("/add-to-cart",  (req, res) => { // supposed to use "app.post" to get data data from an html form
app.get("/add-to-cart",  (req, res) => {
  // var newItem = req.body; // must install and use "body-parser" middleware to parse req.body 
  var newItem = {item: "item 1", quantity: 2, price: "12.86"};
  console.log("req.session.cart.items : ", req.session.user.cart.items );
  req.session.user.cart.items.push(newItem);
  // recalculate total
  
  // res.status(200).end();
  res.redirect("/cart-items");
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

function ensureCustomer(req, res, next) {
  if (!req.session.user.role || req.session.user.role != "customer") {
    res.redirect("/login");
  } else {
    next();
  }
}

function ensureClerk(req, res, next) {
  if (req.session.user != "dataEntry") {
    res.redirect("/login");
  } else {
    next();
  }
}
  
// Connect to the DB and start the server
// app.listen(HTTP_PORT, onHttpStart);
dataService.connect().then(()=>{
  app.listen(HTTP_PORT, ()=>{console.log("API listening on: " + HTTP_PORT)});
})
.catch((err)=>{
  console.log("unable to start the server: ", err.message);
  console.log("Did you remember to set your MongoDB Connection String in .env?");
  process.exit();
});