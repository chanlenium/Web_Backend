var mongoose = require("mongoose");
var Schema = mongoose.Schema;

require('dotenv').config(); // for reaging the .env file

// connect to the localhost MongoDB running on default port 27017
// mongoose.connect("mongodb://localhost/web322", {useNewUrlParser: true, useUnifiedTopology: true});

// connect to MongoDB on cloud - MongoDB Altas using connection string (see the .env file)
mongoose.connect(process.env.MONGODB_CONN_STR, {useNewUrlParser: true, useUnifiedTopology: true});

// define the company schema
var companySchema = new Schema({
  "companyName":  String,
  "address": String,
  "phone": String,
  "employeeCount": {
    "type": Number,
    "default": 0
  },
  "country": String  
});

var Company = mongoose.model("web322_companies", companySchema);

//------------------------------------------------
// CRUD operations
// create a new company
var kwikEMart = new Company({
    companyName: "The Kwik-E-Mart",
    address: "Springfield",
    phone: "212-842-4923",
    employeeCount: 3,
    country: "U.S.A"
});

// save the company
kwikEMart.save((err) => {
if(err) {
    console.log("There was an error saving the Kwik-E-Mart company");
} else {
    console.log("The Kwik-E-Mart company was saved to the web322_companies collection");
}
// exit the program after saving
process.exit();
});
