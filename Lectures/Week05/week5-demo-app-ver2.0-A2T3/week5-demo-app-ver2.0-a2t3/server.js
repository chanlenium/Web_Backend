var express = require("express");
var app = express();
const multer = require("multer"); // parser for form with file uploads field
var path = require("path");

let dataService = require('./data-service');

var HTTP_PORT = process.env.PORT || 8080;

const bodyParser = require("body-parser"); // parser for the forms that has no file upload fields
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

app.use(express.static("./public/"));

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// debuggin using console.log("data desc: ", data)
console.log("mealPackages: ", dataService.getMealPackages());

// multer requires a few options to be setup to store files with file extensions
// by default it won't store extensions for security reasons
const storage = multer.diskStorage({
    destination: "./public/images/",
    filename: function (req, file, cb) {
      // we write the filename as the current date down to the millisecond
      // in a large web service this would possibly cause a problem if two people
      // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
      // this is a simple example.
      cb(null, Date.now() + path.extname(file.originalname));
    }
});

// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });


// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

// define a 'route' whose path contains a parameter
app.get("/user/:userId", function(req,res){
  res.send( { message: "the passed in url parameter is: " + req.params.userId});
});

// define a 'route' that can accept query string (e.g. 2 keys (page and perPage) with values)
app.get("/users?page=2&perPage=8", function(req,res){
  res.send( { message: "the passed in page in query string is: " + req.query.page});
});

// define a route to show a page with a form that has no file upload
app.get("/userform",  (req, res) => {
    res.sendFile(path.join(__dirname, "/views/userform.html"));
});

// define a route to to handle the user form submission
app.post("/userform",  (req, res) => {
  res.send({"Password: ": req.body.password});
});

// define a route to show a page with Bootstrap and a form that has no file upload
app.get("/userformbs",  (req, res) => {
    res.sendFile(path.join(__dirname, "/views/userformBS.html"));
});

// for processing the form submission
app.post("/userformbs",  (req, res) => {
  let formData = req.body;

  console.log("All entered form data, which has been parsered to a JavaScript object: ", req.body);

  // if (dataService.validatFirstName() && dataService.validatLasttName() /*&& ...*/) {
  if (true) {
     dataService.register(req.body);
    res.send({"message": req.body.username + " was registered", "data": req.body});
  } else {
    // what to do here?
  }
   
});

// define a route to show a page with a form that has file upload field
app.get("/register-user",  (req, res) => {
    res.sendFile(path.join(__dirname, "/views/registerUser.html"));
});

// now add a route that we can POST the form data to
// IE: http://localhost/register-user
// add the middleware function (upload.single("photo")) for multer to process the file upload in the form
// the string you pass the single() function is the value of the
// 'name' attribute on the form for the file input element
app.post("/register-user", upload.single("photo"), (req, res) => {
    // res.send(req.body);
  const formData = req.body;
  const formFile = req.file;

  const dataReceived = "User name: " + req.body.username + "<hr>" +
    "Your submission was received:<br/><br/>" +
    "Your form data was:<br/>" + JSON.stringify(formData) + "<br/><br/>" +
    "Your File data was:<br/>" + JSON.stringify(formFile) +
    "<br/><p>This is the image you sent:<br/><img src='/images/" + formFile.filename + "'/>";
  res.send(dataReceived);
});

// We use this function to handle 404 requests to pages that are not found.
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);


// ************ The Express middlewares for the processing HTML form on server ************//
// 1. the form has a file-select field (& a "browse" button) for file uploads, i.e.
//     <form  action="/xyz" method="POST" enctype="multipart/form-data">
//       <input id="photo" type="file" name="photo"/><br />
//       <!-- more forms field and/or buttons -->
//     </form>
//
//  ** To process this form (with file uploads), the middleware "multer" is used on server. 
//     note: the enctype="multipart/form-data" attribute must be in the <form> element 
//---------------------------------------------------------------------------------------//
// 2. the form has no file-select field (& a "browse" button) for file uploads, e.g.
//     <form  action="/xyz2" method="POST">
//       <input id="username" name="username"  type="text" /><br />
//       <input id="email" name="email" type="email" />
//       <button type="submit">Submit</button>
//     </form>
//  ** To process this form (without file uploads), the middleware "body-parser" is used 
//     on server: 
//     
//     const bodyParser = require("body-parser"); // for the forms that has no file upload fields
//     app.use(bodyParser.urlencoded({ extended: true }));
//
//     app.post("/userformbs",  (req, res) => {
//        res.send(req.body.username);
//     });
//
