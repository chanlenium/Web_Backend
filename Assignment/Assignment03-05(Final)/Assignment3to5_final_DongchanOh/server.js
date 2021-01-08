/*********************************************************************************
 *  WEB322 – Assignment 03-05
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 *  Name: Dongchan Oh, Student ID: 128975190, Date: 2020-11-25
 *
 *  Online (Heroku, https://evening-badlands-62985.herokuapp.com/) Link: https://evening-badlands-62985.herokuapp.com/
 *
 ********************************************************************************/

// setup our requires
const express = require("express");
const app = express();

// add a library for dealing with file uploads and multipart/form-data
const multer = require("multer");

// add a new require for the path module
var path = require("path");

// add a library for the client-sessions
const clientSessions = require("client-sessions");

// add a library for simply using text form data
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// add a library for sending an Email
require("dotenv").config();
var nodemailer = require("nodemailer");

// add a library for using Handlebars
const exphbs = require("express-handlebars");

// add a additional libraries
const _ = require("underscore");
const fs = require("fs");
const mongoose = require("mongoose");

// Setup client-sessions (= register clientSessions as a middleware)
app.use(
  clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "web322_assignmentsss", // this should be a long un-guessable string.
    duration: 20 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60, // the session will be extended by this many ms each request (1 minute)
  })
);

// Flag to indicate whether user login(session on) or not.
var sessionInfo = { state: false, userName: "", role: "" };

// for active item/link on navbar
app.use(function (req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = route == "/" ? "/" : route.replace(/\/$/, "");
  next();
});

// Register handlerbars as the rendering engine for views
app.set("views", "./views");
app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      navLink: function (url, options) {
        return (
          "<li" +
          (url == app.locals.activeRoute ? ' class = "active" ' : "") +
          '><a href="' +
          url +
          '">' +
          options.fn(this) +
          "</a></li>"
        );
      },
      sessionOn: function (options) {
        if (sessionInfo.state == true) {
          return (
            '<li><a href="#"><span class="glyphicon glyphicon-user"></span>' +
            sessionInfo.userName +
            "</a></li>" +
            '<li><a href="/logout"><span class="glyphicon glyphicon-log-out"></span> Logout</a></li>'
          );
        } else {
          return (
            '<li><a href="/userregister"><span class="glyphicon glyphicon-user"></span> Sign Up</a></li>' +
            '<li><a href="/login"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>'
          );
        }
      },
      dataEntryClerkOn: function (options) {
        if (sessionInfo.role == "dataEntryClerk") {
          return '<li><a href="/all-meals">My meals</li>';
        } else if (sessionInfo.role == "customer") {
          return '<li><a href="/cart-items">My cart</li>';
        }else{
          return '';
        }
      },
    },
  })
);
app.set("view engine", ".hbs");

// email configuration
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const MealModel = require("./data_models/mealModel");
const PHOTODIRECTORY = "./public/photos";
// make sure the photos folder exists
// if not create it
if (!fs.existsSync(PHOTODIRECTORY)) {
  fs.mkdirSync(PHOTODIRECTORY);
}

const connectionString = process.env.MONGODB_CONN_STR; //connection string

// setup the static folder that static resources(images, css files, etc.) can load from
app.use(express.static("public"));

const HTTP_PORT = process.env.PORT || 8080;

// connect to MongoDB using the model - data-service.js module
const data_service = require("./data-service.js");
const { on } = require("process");
const dataService = data_service(connectionString);

// Connect to the DB and start the server
// app.listen(HTTP_PORT, onHttpStart);
dataService
  .connect()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("API listening on: " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.log("unable to start the server: ", err.message);
    console.log(
      "Did you remember to set your MongoDB Connection String in .env?"
    );
    process.exit();
  });

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// multer requires a few options to be setup to store files with file extensions
// by default it won't store extensions for security reasons
const storage = multer.diskStorage({
  destination: PHOTODIRECTORY,
  filename: (req, file, cb) => {
    // we write the filename as the current date down to the millisecond
    // in a large web service this would possibly cause a problem if two people
    // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
    // this is a simple example.
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// tell multer to use the diskStorage function for naming files instead of the default.
//const upload = multer({ storage: storage });
var upload = multer({
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return callback(new Error("Only image format allowed!"));
    }
    callback(null, true);
  },
  storage: storage,
}).single("meal");

app.post("/add-meal", function (req, res) {
  upload(req, res, function (err) {
    const userInput = req.body;
    if (err) {
      var fileErrorMsg =
        "User can only upload an image files (i.e., jpgs, gifs, or pngs)";
      res.render("add-meal", {
        data: { userInput: userInput, errorMsg: fileErrorMsg },
      });
      //return res.send('Wrong File Type')
    } else {
      const mealMetadata = new MealModel({
        filename: req.file.filename,
        title: req.body.title,
        price: req.body.price,
        category: req.body.category,
        noOfMeals: req.body.noOfMeals,
        content: req.body.content,
      });
      if (req.body.topOrNot == "yesTop") {
        mealMetadata.isTopMealPackage = true;
      } else {
        mealMetadata.isTopMealPackage = false;
      }

      mealMetadata
        .save()
        .then((result) => {
          res.redirect("/all-meals");
          // res.status(201).json({
          //   message: "User registered successfully!",
          // })
        })
        .catch((err) => {
          locals.message = "There was an error uploading your meal";
          console.log(message, err);
          //res.render("add-meal", locals);
        });
    }
  });
});

// connect to your mongoDB database
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// console.log when the DB is connected
mongoose.connection.on("open", () => {
  console.log("Database connection open.");
});

app.get("/add-meal", ensureClerk, (req, res) => {
  // CREATE ('C'rud)
  res.render("add-meal");
});

app.post("/remove-meal/:filename", (req, res) => {
  // DELETE (cru'D')
  // we are using the url itslef to contain the filename of the meal we want to remove.
  // The ":filename" part of the url is a dynamic parameter
  // "req.params" holds the dynamic parameters of a url
  const filename = req.params.filename;

  // remove the meal
  MealModel.remove({ filename: filename })
    .then(() => {
      // now remove the file from the file system.
      fs.unlink(PHOTODIRECTORY + filename, (err) => {
        if (err) {
          return console.log(err);
        }
        console.log("Removed file : " + filename);
      });
      // redirect to "all-meals" page once the removal is done.
      return res.redirect("/all-meals");
    })
    .catch((err) => {
      // if there was an error removing the meal, log it, and redirect to home.
      console.log(err);
      return res.redirect("/");
    });
});

app.get("/edit-meal", ensureClerk, (req, res) => {
  // UPDATE (cr'U'd)
  res.render("edit-meal");
});

app.post("/edit-meal/:filename", (req, res) => {
  const filename = req.params.filename;
  dataService
    .getMealByFileName(filename)
    .then((mealInfo) => {
      mealInfo[0].isEdit = true;
      res.render("edit-meal", {
        data: { userInput: mealInfo[0] },
      });
    })
    .catch((err) => {
      res.status(500).end();
    });
});

app.post("/edit-meal", (req, res) => {
  dataService
    .updateMany(req.body)
    .then(() => {
      res.redirect("/all-meals");
    })
    .catch((err) => {
      res.status(500).end();
    });
});

app.get("/all-meals", ensureClerk, (req, res) => {
  // READ (c'R'ud)
  MealModel.find()
    .lean()
    .exec()
    .then((meals) => {
      _.each(meals, (meal) => {
        meal.uploadDate = new Date(meal.createdOn).toDateString();
      });
      res.render("all-meals", { meals: meals, hasMeals: !!meals.length });
    });
});

// setup route to listen on /home
app.get("/", function (req, res) {
  // res.sendFile(path.join(__dirname, "/views/home.html"));
  dataService
    .getAllMeals()
    .then((mealpackageData) => {
      res.render("home", {
        data: data_service.getTopMealPackages(mealpackageData),
      });
    })
    .catch((err) => {
      res.status(500).end();
    });
});

// setup another route to listen on /mealspackage
app.get("/mealspackage", function (req, res) {
  dataService
    .getAllMeals()
    .then((mealpackageData) => {
      res.render("mealspackage", {
        data: data_service.getMealPackages(),
      });
    })
    .catch((err) => {
      res.status(500).end();
    });
});

// setup another route to listen on /userregister
app.get("/userregister", function (req, res) {
  res.render("userregister");
});

// For processing the form submission (not upload file)
app.post("/userregister", (req, res) => {
  const userInput = req.body;
  userInput.isEdit = false;
  var errorMsg = {
    isValid: true,
    fname: "",
    lname: "",
    emailaddress: "",
    password: "",
    password2: "",
  };
  var alreadyRegistered = false;

  if (!data_service.registerValidateName(userInput.fname)) {
    errorMsg.fname += "user first name should be characters";
    errorMsg.isValid = false;
  }
  if (!data_service.registerValidateName(userInput.lname)) {
    errorMsg.lname += "user last name should be characters";
    errorMsg.isValid = false;
  }
  if (!data_service.registerValidateEmail(userInput.emailaddress)) {
    errorMsg.emailaddress += "Seneca student email address is required";
    errorMsg.isValid = false;
  }
  if (!data_service.registerValidatePassword(userInput.password)) {
    errorMsg.password +=
      "Password should be character or number with length 6-12";
    errorMsg.isValid = false;
  }
  if (!data_service.registerValidatePassword(userInput.password)) {
    errorMsg.password +=
      "Password should be character or number with length 6-12";
    errorMsg.isValid = false;
  }
  if (
    !data_service.registerValidateConfirmPassword(
      userInput.password,
      userInput.password2
    )
  ) {
    errorMsg.password2 += "Password should be same";
    errorMsg.isValid = false;
  }

  if (!errorMsg.isValid) {
    res.render("userregister", {
      data: { userInput: userInput, errorMsg: errorMsg },
    });
  } else {
    dataService
      .isUserRegistered(userInput.emailaddress)
      .then((userInfo) => {
        if (userInfo.length == 0) {
          dataService
            .enrollNewUsers(userInput)
            .then((data) => {
              console.log("User " + data + " was registered.");
            })
            .catch((err) => {
              console.log("Not registered, error: " + err);
            });

          var mailOptions = {
            from: "webdcoh@gmail.com",
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
        } else {
          alreadyRegistered = true;
          res.render("login", {
            data: { isRegistered: alreadyRegistered },
          });
        }
      })
      .catch((err) => {
        res.status(500).end();
      });
  }
});

// setup another route to listen on /login
app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", (req, res) => {
  const userInput = req.body;
  var errorMsg = { isValid: true, emailaddress: "", password: "" };
  dataService
    .isUserRegistered(userInput.emailaddress)
    .then((userInfo) => {
      if (userInfo.length == 0) {
        // when the input email does not exists..
        if (!data_service.loginValidate(userInput.emailaddress)) {
          errorMsg.emailaddress += "Enter email address";
          errorMsg.isValid = false;
          if (!data_service.loginValidate(userInput.password)) {
            errorMsg.password += "Enter password";
          }
        } else {
          if (!data_service.loginValidate(userInput.password)) {
            errorMsg.password += "Enter password";
            errorMsg.isValid = false;
          } else {
            errorMsg.emailaddress += "Invalid email!";
            errorMsg.isValid = false;
          }
        }
      } else {
        dataService
          .userLogin(userInput)
          .then((retrunValue) => {
            if (retrunValue == true) {
              errorMsg.isValid = true;
              req.session.user = {
                username: userInfo[0].userFirstName,
                email: userInput.emailaddress,
                role: userInfo[0].role,
                cart: [],
              };
              sessionInfo.state = true;
              sessionInfo.userName = userInfo[0].userFirstName;
              sessionInfo.role = userInfo[0].role;

              if (req.session.user.role == "dataEntryClerk") {
                res.redirect("/all-meals");
              } else if (req.session.user.role == "customer") {
                res.redirect("/cart-items");
              }
            } else {
              errorMsg.password += "Invalid password!";
              errorMsg.isValid = false;
              res.render("login", {
                data: { userInput: userInput, errorMsg: errorMsg },
              });
            }
          })
          .catch((err) => {
            res.status(500).end();
          });
      }
    })
    .catch((err) => {
      res.status(500).end();
    });
});

// setup another route to listen on /about
app.get("/about", function (req, res) {
  res.render("about");
});

// An authenticated route that requires the user to be logged in.
// Notice the middleware 'ensureLogin(Customer or Clerk)' that comes before the function
// that renders the dashboard page
function ensureClerk(req, res, next) {
  if (!req.session.user.role || req.session.user.role != "dataEntryClerk") {
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

// Log a user out by destroying their session and redirecting them to /login
app.get("/logout", function (req, res) {
  sessionInfo.state = false;
  sessionInfo.userName = "";
  sessionInfo.role = '';
  req.session.reset();
  res.redirect("/login");
});

app.get("/detail", (req, res) => {
  res.render("detail");
});

app.post("/detail/:filename", (req, res) => {
  const filename = req.params.filename;
  console.log("filename", filename);
  dataService
    .getMealByFileName(filename)
    .then((mealInfo) => {
      res.render("detail", {
        data: { userInput: mealInfo[0] },
      });
    })
    .catch((err) => {
      res.status(500).end();
    });
});

// app.post("/add-to-cart",  (req, res) => { // supposed to use "app.post" to get data data from an html form
app.post("/add-to-cart", (req, res) => {
  var newItem = req.body;
  let cartLength = req.session.user.cart.length;

  found = false;
  for (let i = 0; i < cartLength && found == false; i++) {
    if (newItem.title === req.session.user.cart[i].title) {
      req.session.user.cart[i].noOfOrders =
        parseInt(req.session.user.cart[i].noOfOrders) +
        parseInt(newItem.noOfOrders);
      req.session.user.cart[i].subTotal = (
        parseFloat(req.session.user.cart[i].noOfOrders) *
        parseFloat(newItem.prodPrice)
      ).toFixed(2);
      found = true;
    }
  }

  if (!found) {
    if (cartLength == 0) {
      req.session.user.priceTotal = parseFloat(0).toFixed(2);
    }
    req.session.user.cart[cartLength] = newItem;
    req.session.user.cart[cartLength].subTotal = (
      parseFloat(newItem.prodPrice) * parseFloat(newItem.noOfOrders)
    ).toFixed(2);
    cartLength++;
  }

  req.session.user.priceTotal = 0;
  for (let i = 0; i < cartLength; i++) {
    req.session.user.priceTotal = (
      parseFloat(req.session.user.priceTotal) +
      parseFloat(req.session.user.cart[i].subTotal)
    ).toFixed(2);
  }
  res.redirect("/cart-items");
});

app.get("/cart-items", ensureCustomer, (req, res) => {
  if (isNaN(req.session.user.priceTotal)) {
    req.session.user.priceTotal = 0;
  }
  res.render("cart-items", {
    cart: req.session.user.cart,
    priceTotal: data_service.formatter.format(req.session.user.priceTotal),
  });
});

app.post("/orderCompleted", (req, res) => {
  orderSummary = `Your orders are summarized as follows
  ======================================`;
  for (let i = 0; i < req.session.user.cart.length; i++) {
    let index = (i + 1).toString();
    orderSummary += `
    Order Index : ${index.padStart(5, " ")}`;
    orderSummary += `
    Title : ${req.session.user.cart[i].title.padStart(25, " ")}`;
    orderSummary += `
    Number of Orders : ${req.session.user.cart[i].noOfOrders
      .toString()
      .padStart(5, " ")}`;
    orderSummary += `
    ----------------------------------------`;
  }
  orderSummary += `
  Order Total : ${data_service.formatter
    .format(req.session.user.priceTotal)
    .padStart(19, " ")}`;

  var mailOptions = {
    from: "webdcoh@gmail.com",
    to: req.session.user.email,
    subject: "Your order conformation",
    text: orderSummary,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  req.session.user.cart = [];
  req.session.user.priceTotal = 0;
  res.redirect("/about");
});

// This use() will not allow requests to go beyond it
// so we place it at the end of the file, after the other routes.
// This function will catch all other requests that don't match any other route handlers declared before it.
// This means we can use it as a sort of 'catch all' when no route match is found.
// We use this function to handle 404 requests to pages that are not found.
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});
