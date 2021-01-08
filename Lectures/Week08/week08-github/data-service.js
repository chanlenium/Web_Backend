const mongoose = require('mongoose');

mongoose.Promise = global.Promise; // Added to get around the deprecation warning: "Mongoose: mpromise (mongoose's default promise library) is deprecated"

// Load the schemas
const companySchema = require('./data_models/company.js');
// const employeeSchema = require('./data_models/employee.js');

module.exports = function(mongoDBConnectionString){

    let Company; // defined on connection to the new db instance
    let Employee; // defined on connection to the new db instance


    return {
        connect: function(){
            return new Promise(function(resolve,reject){
                console.log(mongoDBConnectionString);
                let db = mongoose.createConnection(mongoDBConnectionString, 
                    { 
                        useNewUrlParser: true, 
                        useUnifiedTopology: true, 
                        useCreateIndex: true 
                    });
                console.log(db);
                db.on('error', (err)=>{
                    reject(err);
                });
        
                db.once('open', ()=>{
                    Company = db.model("Company", companySchema); // the created database collection (table) name will be "companies"
                    // Company = db.model("web322_companies", companySchema);

                    // Employee = db.model("Employee", employeeSchema);

                    resolve();
                });
            });
        },
        getAllCompanies: function(){
            return new Promise(function(resolve,reject){
                //console.log(Company);
                Company.find()
                //.sort({}) //optional "sort" - https://docs.mongodb.com/manual/reference/operator/aggregation/sort/ 
                .exec()
                .then((data) => {
                    companies = data.map(value => value.toObject());
                    console.log("companies", companies);
                    resolve(companies);
                })
                .catch((err)=>{
                    reject(err);
                });
            })
        },    
        getCompanyById: function(companyId){
            return new Promise(function(resolve,reject){

                Company.find({_id: companyId})
                //.sort({}) //optional "sort" - https://docs.mongodb.com/manual/reference/operator/aggregation/sort/ 
                .limit(1)
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
        },


        
    }

}