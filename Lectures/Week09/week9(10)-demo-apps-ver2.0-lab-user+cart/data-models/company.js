// require mongoose and setup the Schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
  

module.exports = companySchema;