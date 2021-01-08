// require mongoose and setup the Schema
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

require('dotenv').config(); // for reaging the .env file

// connect to the localhost mongo running on default port 27017
// mongoose.connect("mongodb://localhost/web322", { useNewUrlParser: true });
// mongoose.connect("mongodb+srv://dbadmin:dbpasswd@senecaweb.x0fzf.mongodb.net/web322_week8?retryWrites=true&w=majority");

let db1 = mongoose.createConnection("mongodb://localhost/web322", {useNewUrlParser: true, useUnifiedTopology: true});
let db2 = mongoose.createConnection(process.env.MONGODB_CONN_STR, {useNewUrlParser: true, useUnifiedTopology: true});

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

  // register the Company model using the companySchema
  // use the web322_companies collection in the db to store documents
  var Company1 = db1.model("web322_companies", companySchema);
  var Company2 = db2.model("web322_companies", companySchema);

  Company1.find()
  .exec()
  .then((company) => {
      if(!company) {
          console.log("No company could be found in db1");
      } else {
          console.log("in db1 (Local MongoDb): ", company);
      }
      // exit the program after saving and finding
    //   process.exit();
  })
  .catch((err) => {
      console.log(`There was an error: ${err}`);
  });

  Company2.find()
  .exec()
  .then((company) => {
      if(!company) {
          console.log("No company could be found in db2");
      } else {
          console.log("in db2 (MongoDb Atlas): ", company);
      }
      // exit the program after saving and finding
      process.exit();
  })
  .catch((err) => {
      console.log(`There was an error: ${err}`);
  });