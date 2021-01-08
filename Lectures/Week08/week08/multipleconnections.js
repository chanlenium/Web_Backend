// require mongoose and setup the Schema
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// connect 
let pass1 = encodeURIComponent("Ss5170148!"); // this step is needed if there are special characters in your password, ie "$"
//let db1 = mongoose.createConnection(`mongodb://dbUser:${pass1}@senecaweb-shard-00-00-abcde.mongodb.net:27017,senecaweb-shard-00-01-abcde.mongodb.net:27017,senecaweb-shard-00-02-abcde.mongodb.net:27017/db1?ssl=true&replicaSet=SenecaWeb-shard-0&authSource=admin&retryWrites=true`);
let db1 = mongoose.createConnection(`mongodb+srv://dcoh:${pass1}@senecaweb.megxd.mongodb.net/<dbname>?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});

// verify the db1 connection
db1.on('error', (err)=>{
    console.log("db1 error!");
});
db1.once('open', ()=>{
    console.log("db1 success!");
});

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

// predefined "companySchema" used to create "model1" on db1
var model1 = db1.model("model1", companySchema);