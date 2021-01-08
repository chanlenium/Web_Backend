// require mongoose and setup the Schema
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// connect to the localhost mongo running on default port
//mongoose.connect("mongodb://localhost/web322");
// connect to the remote mongo server (Atlas cloud)
mongoose.connect("mongodb+srv://dcoh:Ss5170148!@senecaweb.megxd.mongodb.net/web322_week8?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true})


// define the company schema
var companySchema = new Schema({
    "companyName": {
        "type": String,
        "unique": true
    },
    "address": String,
    "phone": String,
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
    companyName: "The Kwik-E-Mart 14",
    address: "Springfield",
    phone: "212-842-4923",
    employeeCount: 3,
    country: "U.S.A"
});

//save the company
kwikEMart.save((err) => {
    if(err){
        console.log("There was an error saving the Kwik-E-Mart company");
    }else{
        console.log("The Kwik-E-Mart company was saved to the web322_companies collection");
        Company.findOne({companyName: "The Kwik-E-Mart"})
        .exec() // tell mongoose to return a promise
        .then((company)=>{
            if(!company){
                console.log("No company could be found");
            }else{
                console.log(company);
                // exit the program after saving
                process.exit();
            }
        })
        .catch((err)=>{
            console.log(`There was an error: ${err}`);
        });
    } 
});