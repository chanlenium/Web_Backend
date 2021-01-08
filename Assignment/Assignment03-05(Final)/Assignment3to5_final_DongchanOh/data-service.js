const mongoose = require("mongoose");
// Added to get around the deprecation warning: "Mongoose: mpromise (mongoose's default promise library) is deprecated"
mongoose.Promise = global.Promise;

// add a library for Password Encryption
const bcrypt = require('bcryptjs');

// Load the schemas
const mealSchema = require("./data_models/mealModel.js");
const userSchema = require("./data_models/userModel.js");

module.exports = function (mongoDBConnectionString) {
  let Meal; // defined on connection to the new db instance
  let User; // defined on connection to the new db instance

  return {
    connect: function () {
      return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection(mongoDBConnectionString, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
        });

        db.on("error", (err) => {
          reject(err);
        });

        db.once("open", () => {
          Meal = db.model("meal", mealSchema.getMealSchema()); // collection명칭이 복수형으로 바뀌어 저장됨(ex, meal -> meals)
          User = db.model("User", userSchema); // the created database collection (table) name will be "companies"
          resolve();
        });
      });
    },
    getAllMeals: function () {
      return new Promise(function (resolve, reject) {
        Meal.find()
          //.sort({}) //optional "sort" - https://docs.mongodb.com/manual/reference/operator/aggregation/sort/
          .exec()
          .then((data) => {
            mealPackages = data.map((value) => value.toObject());
            resolve(mealPackages);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    enrollNewUsers: function (UserInfo) {
      return new Promise(function (resolve, reject) {
        bcrypt
          .hash(UserInfo.password, 10)
          .then((hash) => {
            UserInfo.password = hash;
            var newUser = new User({
              userFirstName: UserInfo.fname,
              userLastName: UserInfo.lname,
              userEmail: UserInfo.emailaddress,
              userPassWord: UserInfo.password,
              isDataEntryClerk: false,
            });
            newUser.save((err, addedUser) => {
              if (err) {
                if (err.code == 11000) {
                  reject("User Name already taken");
                } else {
                  reject("There was an error creating the user: " + err);
                }
              } else {
                console.log("The user saved to the collection");
                resolve(addedUser.email);
              }
            });
          })
          .catch((err) => {
            console.log(err); // Show any errors that occurred during the process
          });
      });
    },
    isUserRegistered: function (userEmail) {
      return new Promise(function (resolve, reject) {
        User.find({ userEmail: userEmail })
          //.sort({}) //optional "sort" - https://docs.mongodb.com/manual/reference/operator/aggregation/sort/
          .limit(1)
          .exec()
          .then((user) => {
            let userInfo = user.map((value) => value.toObject());
            resolve(userInfo);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getMealByFileName: function (fileName) {
      return new Promise(function (resolve, reject) {
        Meal.find({ filename: fileName })
          //.sort({}) //optional "sort" - https://docs.mongodb.com/manual/reference/operator/aggregation/sort/
          .limit(1)
          .exec()
          .then((data) => {
            mealInfo = data.map((value) => value.toObject());
            resolve(mealInfo);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    updateMany: function (mealInfo) {
      return new Promise(function (resolve, reject) {
        if (Object.keys(mealInfo).length > 0) {
          // if there is data to update
          Meal.update(
            { filename: mealInfo.fileName },
            {
              $set: {
                title: mealInfo.title,
                price: mealInfo.price,
                category: mealInfo.category,
                noOfMeals: mealInfo.noOfMeals,
                content: mealInfo.content,
              },
            },
            { multi: false }
          )
            .exec()
            .then((data) => {
              resolve(mealInfo);
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          resolve();
        }
      });
    },
    userLogin: function (userData) {
      return new Promise(function (resolve, reject) {
        User.findOne({ userEmail: userData.emailaddress })
          .exec()
          .then((user) => {
            var jsUser = user.toObject();
            bcrypt
              .compare(userData.password, jsUser.userPassWord)
              .then((result) => {
                if (result === true) {
                  resolve(true);
                } else {
                  resolve(false);
                }
              });
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
  };
};

module.exports.getTopMeals = function () {
  return topMeals;
};

module.exports.getMealPackages = function () {
  return mealPackages;
};

module.exports.getTopMealPackages = function (mealPackages) {
  var topMealPackages = [];
  for (element in mealPackages) {
    if (mealPackages[element].isTopMealPackage == true) {
      topMealPackages.push(mealPackages[element]);
    }
  }
  return topMealPackages;
};

module.exports.registerValidateName = function (name) {
  let pattern = /^[a-zA-Z\-]+$/;
  return pattern.test(name);
};

module.exports.registerValidateEmail = function (email) {
  let pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(email) && email.includes("@myseneca.ca");
};

module.exports.registerValidatePassword = function (pw) {
  let pattern = /^[a-zA-Z0-9]{6,12}$/;
  return pattern.test(pw);
};

module.exports.registerValidateConfirmPassword = function (pw, pw2) {
  return pw == pw2;
};

module.exports.loginValidate = function (input) {
  return input.trim();
};

module.exports.formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});
