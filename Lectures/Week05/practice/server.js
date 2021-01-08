// (1) npm init
// (2) npm install express
// (3) node server.js

const express = require("express");
const app = express();

// library for dealing with file uploads and multipart/form-data
const multer = require("multer");

// add a new require for the path module
var path = require("path");

// setup the static folder that static resources can load from
// like images, css files, etc.
app.use(express.static("static"));

// library for simply using text form data
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}


// multer requires a few options to be setup to store files with file extensions
// by default it won't store extensions for security reasons
const storage = multer.diskStorage({
    destination: "./static/images/",
    filename: function (req, file, cb) {
      // we write the filename as the current date down to the millisecond
      // in a large web service this would possibly cause a problem if two people
      // uploaded an image at the exact same time. 
      // A better way would be to use GUID's for filenames.
      // this is a simple example.
      cb(null, Date.now() + path.extname(file.originalname));
    }
});

// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });

// setup a route on the 'root' of the url
// IE: http://localhost:8080/
app.get("/", (req, res) =>{
    //res.send("Hello World")
    res.send("<h1>Welcome to my simple website</h1><p>Be sure to visit the <a href='/headers'>headers page</a> to see what headers were sent from your browser to the server!</p>");
});

// now add a route for the /headers page
// IE: http://localhost:8080/headers
app.get("/headers", (req, res) => {
    const headers = req.headers;
    res.send(headers);
});

// now add a route for the /userform page
// IE: http://localhost:8080/userform
app.get("/userform", (req, res) => {
    // send the html view with our form to the client
    res.sendFile(path.join(__dirname, "/views/userform.html"));
});

// For processing the form submission (not upload file)
app.post("/userform", (req, res) => {
    res.send(req.body.name);//{"Password: " : req.body.password});
});


// now add a route for the /userform page
// IE: http://localhost:8080/userformbs
app.get("/userformbs", (req, res) => {
    // send the html view with our form to the client
    res.sendFile(path.join(__dirname, "/views/userformBS.html"));
});

// For processing the form submission (not upload file)
app.post("/userformbs", (req, res) => {
    res.send(req.body.username);
});


// now add a route for the /registeruser page
// IE: http://localhost:8080/register-user
app.get("/register-user", (req, res) => {
    // send the html view with our form to the client
    res.sendFile(path.join(__dirname, "/views/registeruser.html"));
});

// now add a route that we can POST(process) the form data to
// IE: http://localhost/register-user
// add the middleware function (upload.single("photo")) for multer to process the file upload in the form
// the string you pass the single() function is the value of the
// 'name' attribute on the form for the file input element
app.post("/register-user", upload.single("photo"), (req, res) => {
    //res.send("register");
    //res.send(req.body);
    const formData = req.body;
    const formFile = req.file;
    
    const dataReceived = "User name: " + req.body.username + "<hr>" +
    "Your submission was received:<br/><br/>" +
    "Your form data was:<br/>" + JSON.stringify(formData) + "<br/><br/>" +
    "Your File data was:<br/>" + JSON.stringify(formFile) +
    "<br/><p>This is the image you sent:<br/><img src='/images/" + formFile.filename + "'/>";
    res.send(dataReceived);
  });



// When you write a middleware function with 4 parameters, 
// it will be interpreted by express as an error handler function.
function handleClientError(err, req, res, next) {
    // log the error to the DB with a utility method to log errors  
    logError(err);
  
    // if the request was an xhr request respond with a 500 status and JSON message
    // otherwise respond with a string message
    if (req.xhr) {
      res.status(500).send({ message: 'There was an error processing your request' })
    } else {
      res.status(500).send('Something went wrong processing your request')
    }  
}

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