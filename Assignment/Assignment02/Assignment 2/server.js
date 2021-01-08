/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Dongchan Oh        Student ID: 128975190        Date: 2020-10-24
*
*  Online (Heroku, https://...) Link: https://evening-badlands-62985.herokuapp.com/
*
*  GitHub or Bitbucket repo Link: https://github.com/chanlenium/my-app-web322
*
********************************************************************************/

const express = require("express");
const app = express();

// add a new require for the path module
var path = require("path");

// library for dealing with file uploads and multipart/form-data
const multer = require("multer");

// library for simply using text form data
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// library for using Handlebars
const exphbs = require("express-handlebars");
app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
  })
);
app.set("view engine", ".hbs");

let serviceData = require("./data-service");

// library for sending an Email
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "webdcoh@gmail.com",
    pass: "djddkqkqh!1",
  },
});

const HTTP_PORT = process.env.PORT || 8080;

// setup the static folder that static resources can load from
// like images, css files, etc.
app.use(express.static("static"));

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup a route on the 'root' of the url
// IE: http://localhost:8080/
app.get("/", function (req, res) {
  // send the html view with our form to the client
  // res.sendFile(path.join(__dirname, "/views/home.html"));
  res.render("home", {
    data: serviceData.getTopMeals(),
    //layout: false // do not use the default Layout (main.hbs)
  });
});

// setup another route to listen on /mealspackage
// IE: http://localhost:8080/mealspackage
app.get("/mealspackage", function (req, res) {
  // res.sendFile(path.join(__dirname, "/views/mealspackage.html"));
  res.render("mealspackage", {
    data: serviceData.getMealPackages(),
    //layout: false // do not use the default Layout (main.hbs)
  });
});

// setup another route to listen on /customerregister
// IE: http://localhost:8080/customerregister
app.get("/customerregister", function (req, res) {
  //res.sendFile(path.join(__dirname, "/views/customerregister.html"));
  res.render("customerregister");
});

// For processing the form submission (not upload file)
app.post("/customerregister", (req, res) => {
  const userInput = req.body;
  var errorMsg = {
    isValid: true,
    fname: "",
    lname: "",
    emailaddress: "",
    password: "",
    password2: "",
  };

  if (!serviceData.registerValidateName(userInput.fname)) {
    errorMsg.fname += "user first name should be characters";
    errorMsg.isValid = false;
  }
  if (!serviceData.registerValidateName(userInput.lname)) {
    errorMsg.lname += "user last name should be characters";
    errorMsg.isValid = false;
  }
  if (!serviceData.registerValidateEmail(userInput.emailaddress)) {
    errorMsg.emailaddress += "Seneca student email address is required";
    errorMsg.isValid = false;
  }
  if (!serviceData.registerValidatePassword(userInput.password)) {
    errorMsg.password +=
      "Password should be character or number with length 6-12";
    errorMsg.isValid = false;
  }
  if (!serviceData.registerValidatePassword(userInput.password)) {
    errorMsg.password +=
      "Password should be character or number with length 6-12";
    errorMsg.isValid = false;
  }
  if (
    !serviceData.registerValidateConfirmPassword(
      userInput.password,
      userInput.password2
    )
  ) {
    errorMsg.password2 += "Password should be same";
    errorMsg.isValid = false;
  }
  if (!errorMsg.isValid) {
    res.render("customerregister", {
      data: { userInput: userInput, errorMsg: errorMsg },
    });
  } else {
    var mailOptions = {
      from: "dynamic.oh@gmail.com",
      to: userInput.emailaddress,
      subject: "Welcome to Food Delivery",
      text: "Welcome to Food Delivery!",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.render("about");
  }
});

// setup another route to listen on /login
// IE: http://localhost:8080/login
app.get("/login", function (req, res) {
  //res.sendFile(path.join(__dirname, "/views/login.html"));
  res.render("login");
});

// For processing the form submission (not upload file)
app.post("/login", (req, res) => {
  const userInput = req.body;
  var errorMsg = { isValid: true, emailaddress: "", password: "" };
  if (!serviceData.loginValidate(userInput.emailaddress)) {
    errorMsg.emailaddress += "Enter email address";
    errorMsg.isValid = false;
  }
  if (!serviceData.loginValidate(userInput.password)) {
    errorMsg.password += "Enter password";
    errorMsg.isValid = false;
  }
  //console.log("email : ", serviceData.loginValidate(userInput.emailaddress));
  //console.log("password : ", serviceData.loginValidate(userInput.password));
  if (!errorMsg.isValid) {
    res.render("login", {
      data: { userInput: userInput, errorMsg: errorMsg },
    });
  } else {
    res.send(userInput);
  }
});

// setup another route to listen on /about
// IE: http://localhost:8080/about
app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/viewData", function (req, res) {
  var someData = {
    name: "John",
    age: 23,
    occupation: "developer",
    company: "Scotiabank",
  };

  res.render("viewData", {
    data: someData,
    layout: false, // do not use the default Layout (main.hbs)
  });
});

// This use() will not allow requests to go beyond it
// so we place it at the end of the file, after the other routes.
// This function will catch all other requests that don't match any other route handlers declared before it.
// This means we can use it as a sort of 'catch all' when no route match is found.
// We use this function to handle 404 requests to pages that are not found.
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

// listen on port 8080\. The default port for http is 80, https is 443\. We use 8080 here
// because sometimes port 80 is in use by other applications on the machine
app.listen(HTTP_PORT, onHttpStart);
