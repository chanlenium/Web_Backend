const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


mongoose.Promise = global.Promise; // Added to get around the deprecation warning: "Mongoose: mpromise (mongoose's default promise library) is deprecated"

// Load the schemas
const companySchema = require('./data-models/company');
const userSchema = require('./data-models/user');
// const employeeSchema = require('./data_models/employee.js');

module.exports = function(mongoDBConnectionString){

    let Company; // defined on connection to the new db instance
    // let Employee; // defined on connection to the new db instance
    let User;

    return {
        connect: function(){
            return new Promise(function(resolve,reject){
                let db = mongoose.createConnection(mongoDBConnectionString, 
                    { 
                        useNewUrlParser: true, 
                        useUnifiedTopology: true, 
                        useCreateIndex: true 
                    });
                
                db.on('error', (err)=>{
                    reject(err);
                });
        
                db.once('open', ()=>{
                    // Company = db.model("Company", companySchema); // the created database collection (table) name will be "companies"
                    Company = db.model("web322_companies", companySchema);
                    // Employee = db.model("Employee", employeeSchema);
                    User = db.model("User", userSchema);

                    resolve();
                });
            });
        },
        getAllCompanies: function(){
            return new Promise(function(resolve,reject){

                Company.find()
                //.sort({}) //optional "sort" - https://docs.mongodb.com/manual/reference/operator/aggregation/sort/ 
                .exec()
                .then((data) => {
                    companies = data.map(value => value.toObject());
                    console.log("companies", companies);
                    resolve(companies);
                })
                .catch((err)=>{
                    console.log(err)
                });
            })
        },    
        getCompanyById: function(companyId){
            return new Promise(function(resolve,reject){

                // Company.find({_id: companyId})
                // .limit(1)
                Company.findOne({_id: companyId})
                .exec()
                .then((company) => {
                    resolve(company.toObject());
                })
                .catch((err)=>{
                    reject(err);
                });
            })
        },
        updateCompanyById: function (companyId, companyData) {
            return new Promise(function (resolve, reject) {
                if (Object.keys(companyData).length > 0) { // if there is data to update
                    Company.update({ _id: companyId }, // replace the current company with data from companyData
                        {
                            $set: companyData
                        },
                        { multi: false })
                        .exec()
                        .then((data) => {
                            resolve(companyId);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                } else {
                    resolve();
                }
            });
        },
        addCompany: function (companyData) {
            return new Promise(function (resolve, reject) {
                
                // Create a newCompany from the companyData
                var newCompany = new Company(companyData);

                newCompany.save((err,addedCompany) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(addedCompany._id);
                    }
                });
            });
        } ,

        getAllEmployees: function(){
            return new Promise(function(resolve,reject){

                Employee.find()
                //.sort({}) //optional "sort" 
                .exec()
                .then((employees) => {
                    resolve(employees);
                })
                .catch((err)=>{
                    reject(err);
                });
            })
        } ,

        addUser: function (userData) { // register
            return new Promise(function (resolve, reject) {
                
            // Encrypt the plain text: "myPassword123"
            bcrypt.hash(userData.password, 10).then(hash=>{ // Hash the password using a Salt that was generated using 10 rounds
                // TODO: Store the resulting "hash" value in the DB
                userData.password = hash;

                // Create a newuser from the userData
                var newUser = new User(userData);

                newUser.save((err,addedUser) => {
                    if(err) {
                        if (err.code == 11000) {
                            reject("User Name already taken");
                        } else {
                            reject("There was an error creating the user: " + err);
                        }
                    } else {
                        // resolve(addedUser._id);
                        resolve(addedUser.email);
                    }
                });
            })
            .catch(err=>{
                console.log(err); // Show any errors that occurred during the process
            });




                
            });
        } ,
        
        login: function(userData){
            console.log("userData in login() function in data-service.js", userData);
            return new Promise(function(resolve,reject){

                User.findOne({username: userData.username})
                .exec()
                .then((user) => {
                    var jsUser = user.toObject();
                    console.log("jsUser in login() function in data-service.js", jsUser);
                    //         Pull the password "hash" value from the DB and compare it to "myPassword123" (match)
                    bcrypt.compare(userData.password, jsUser.password).then((result) => {
                        // result === true
                        if (result === true) {
                            resolve(jsUser);
                        } else {
                            reject("Incorrect password for user " + userData.userName);
                        }
                    });
                })
                .catch((err)=>{
                    reject("Unable to find user " + userData.username);
                });
            })
        } //,
    }

}