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
// Update
Company.updateOne(
    { companyName: "The Kwik-E-Mart"},
    { $set: { employeeCount: 8 } }
  ).exec()
//   .then()
//   .catch();
// 
// // process.exit(); // don't stop here - causeing failure. Call this function in the callback function within .then()!t


// // Delete
// Company.deleteOne({ companyName: "The Kwik-E-Mart" })
//     .exec()
//     .then(() => {
//         // removed company
//         console.log("removed company");

//         // // exit the program after deleting
//         // process.exit();
//     })
//     .catch((err) => {
//     console.log(err);
//     });

