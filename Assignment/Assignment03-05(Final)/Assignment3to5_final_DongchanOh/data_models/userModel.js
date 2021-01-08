// require mongoose and setup the Schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// define the customer schema
var userSchema = new Schema({
    "userFirstName":  String,
    "userLastName": String,
    "userEmail": {
      "type": String,
      "unique": true
    },
    "userPassWord": String,
    "role": {
      type: String,
      default: 'customer' 
    }  
  });
  
module.exports = userSchema;