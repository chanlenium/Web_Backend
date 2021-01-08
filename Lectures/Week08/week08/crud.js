// require mongoose and setup the Schema
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// connect to the localhost mongo running on default port
mongoose.connect("mongodb://localhost/web322");

// define the company schema
var companySchema = new Schema({
    "companyName": String,
    "address": String,
    "employeeCount":{
        "type": Number,
        "default": 0
    },
    "country": String
});

// register the Company model using the companySchema
// tell mongoose to register this schema (companySchema) as a model and connect it to the web322_companies collection 
var Company = mongoose.model("web322_companies", companySchema);

// create a new company
var kwikEMart = new Company({
    companyName: "The Kwik-E-Mart",
    address: "Springfield",
    phone: "212-842-4923",
    employeeCount: 3,
    country: "U.S.A"
});

//save the company
kwikEMart.save((err) => {
    if(err){
         // there was an error
        console.log(err);
    }else{
        // everything good
        console.log(kwikEMart);

        // find()
        Company.find({companyName: "The Kwik-E-Mart"})
        .exec() // tell mongoose to return a promise
        .then((companies)=>{
            // companies will be an array of objects.
            // Each object will represent a document that matched the query

            // Convert the mongoose documents into plain JavaScript objects
            companies = companies.map(value => value.toObject());
        });


        // Selecting specific fields
        // If we wish to limit the results to include only specific fields, 
        // we can pass the list of fields as a space-separated string in the second parameter to the find() method
        Company.find({companyName: "The Kwik-E-Mart"}, "address phone")
        .exec() // tell mongoose to return a promise
        .then((companies)=>{
            // companies will be an array of objects.
            // Each object will represent a document that matched the query

            // Convert the mongoose documents into plain JavaScript objects
            companies = companies.map(value => value.toObject());
        });


        // update() / updateMany()
        // can also use "updateMany" to update multiple documents at once
        Company.updateOne( 
            { companyName: "The Kwik-E-Mart"},
            { $set: { employeeCount: 3 } }
        ).exec();

        // deleteOne() / deleteMany()
        // can also use "deleteMany" to delete multiple documents at once
        Company.deleteOne({ companyName: "The Kwik-E-Mart" })
        .exec()
        .then(()=>{
            // remove company
            console.log("remove company");
        })
        .catch((err) => {
            console.log(err);
        });
    } 
});