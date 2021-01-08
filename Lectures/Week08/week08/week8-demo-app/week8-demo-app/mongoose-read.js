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

// // Read a company - Get One
// Company.findOne({ companyName: "The Kwik-E-Mart" })
//     .exec()
//     .then((data) => {
//         if(!data) {
//             console.log("No company could be found");
//         } else {
//             // Convert the mongoose documents into plain JavaScript objects
//             company = data.toObject();

//             console.log("Company: ", company);
//         }
//         // exit the program
//         process.exit();
//     })
//     .catch((err) => {
//         console.log(`There was an error: ${err}`);
//     });

// Read companies - Get All
Company.find()
    .exec()
    .then((data) => {
        if(!data) {
            console.log("No company could be found");
        } else {
            // Convert the mongoose documents into plain JavaScript objects
            companies = data.map(value => value.toObject());

            console.log("Companies: ", companies);
        }
        // exit the program after finding
        process.exit();
    })
    .catch((err) => {
        console.log(`There was an error: ${err}`);
    });