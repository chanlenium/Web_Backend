// setup our requires
const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const _ = require ("underscore");
const fs = require("fs");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

const PhotoModel = require("./data_models/photoModel");
const PHOTODIRECTORY = "./public/photos";

const HTTP_PORT = process.env.PORT || 8080;

require('dotenv').config(); // for reaging the .env file
// const config = require("./week8-assets/config"); // to be removed(since we use .env)

// const connectionString = config.database_connection_string;
const connectionString = process.env.MONGODB_CONN_STR;  //connection string

// connect to MongoDB using the model - data-service.js module
const data_service = require("./data-service.js");
const dataService = data_service(connectionString);

// use bluebird promise library with mongoose
// mongoose.Promise = require("bluebird");

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// make sure the photos folder exists
// if not create it
if (!fs.existsSync(PHOTODIRECTORY)) {
  fs.mkdirSync(PHOTODIRECTORY);
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
  }
});

// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });

// Register handlerbars as the rendering engine for views
app.set("views", "./views");
app.engine(".hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");

// setup the static folder that static resources can load from
// we need this so that the photo can be loaded from the server
// by the browser after sending it
app.use(express.static("./public/"));

// connect to your mongoDB database
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

// log when the DB is connected
mongoose.connection.on("open", () => {
  console.log("Database connection open.");
});

app.get("/", (req, res) => {
  res.send('<h4><a href="/all-photos">List of Photos (Album)</a></h4>'
         + '<h4><a href="/companies">Companies</h4>');
});

app.get("/all-photos", (req, res) => {
  PhotoModel.find().lean()
  .exec()
  .then((photos) => {
    // underscore ( _ ) is a common library full of utility methods you can use
    // to make certain tasks a lot easier on yourself. Here we use underscore to
    // loop through the photos and and for each photo, set the uploadDate to a 
    // more user friendly date format. http://underscorejs.org/#each
    _.each(photos, (photo) => {
      photo.uploadDate = new Date(photo.createdOn).toDateString();
    });

    // send the html view with our form to the client
    res.render("all-photos", { photos : photos, hasPhotos: !!photos.length, layout: false });
  });
});

app.get("/add-photo", (req, res) => {
  // send the html view with our form to the client
  res.render("add-photo", { 
    layout: false // do not use the default Layout (main.hbs)
  });
});

app.post("/add-photo", upload.single("photo"), (req, res) => {
  // setup a PhotoModel object and save it
  const locals = { 
    message: "Your photo was uploaded successfully",
    layout: false // do not use the default Layout (main.hbs)
  };

  const photoMetadata = new PhotoModel({
    name: req.body.name,
    email: req.body.email,
    caption: req.body.caption,
    filename: req.file.filename
  });

  photoMetadata.save()
  .then((response) => {
    res.render("add-photo", locals);
    console.log("sAVE IT!!");
  })
  .catch((err) => {
    locals.message = "There was an error uploading your photo";

    console.log(err);

    res.render("add-photo", locals);
  });
});

app.post("/remove-photo/:filename", (req, res) => {
  // we are using the url itslef to contain the filename of the photo we
  // want to remove. The :filename part of the url is a dynamic parameter
  // req.params holds the dynamic parameters of a url
  const filename = req.params.filename;

  // remove the photo
  PhotoModel.remove({filename: filename})
  .then(() => {
    // now remove the file from the file system.
    fs.unlink(PHOTODIRECTORY + filename, (err) => {
      if (err) {
        return console.log(err);
      }
      console.log("Removed file : " + filename);
    }); 
    // redirect to home page once the removal is done.
    return res.redirect("/");
  }).catch((err) => {
    // if there was an error removing the photo, log it, and redirect.
    console.log(err);
    return res.redirect("/");
  });
});


app.get("/companies", (req, res) => {
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