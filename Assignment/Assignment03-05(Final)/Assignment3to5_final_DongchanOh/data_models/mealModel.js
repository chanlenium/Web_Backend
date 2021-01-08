// require mongoose and setup the Schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// use bluebird promise library with mongoose
// mongoose.Promise = require("bluebird");

// define the meal schema
const mealSchema = new Schema({
  "filename": {
    type: String,
    unique: true
  },
  "title": String,
  "price": Number,
  "category": String,
  "noOfMeals": Number,
  "content": String,
  "isTopMealPackage": Boolean,
  "createdOn": {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("meals", mealSchema);

module.exports.getMealSchema = function() {
  return mealSchema
}