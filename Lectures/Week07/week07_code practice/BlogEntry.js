const Sequelize = require('sequelize');

// set up sequelize to point to our postgres database
var sequelize = new Sequelize('de4du7otp3p0kc', 'zkwcbmdtmiblfl', 'ea96b27462cd2a645542ba9a3eebeb92c4bfb8e347c37fbcbd51b03bf71aadc5', {
    host: 'ec2-54-156-53-71.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions:{
        ssl:{rejectUnauthorized: false}
    }
});

// Define a "BlogEntry" model
var BlogEntry = sequelize.define('BlogEntry', {
    title: Sequelize.STRING,
    author: Sequelize.STRING,
    entry: Sequelize.TEXT,
    views: Sequelize.INTEGER,
    //postDate: Sequelize.DATE
});

// Synchronize the Database with our models and automatically add the table
// if it does not exist
sequelize.sync().then(function(){
    //create a new "Project" and add it to the database
    BlogEntry.create({
        title: 'Emma garden',
        author: 'Emma',
        entry: 'Cooking Blog',
        views: '10000000',
        //postDate: '20201108'
    }).then(function (project) {
        // you can now access the newly created Project via the variable project
        console.log("success!")
    }).catch(function (error) {
        console.log("something went wrong!");
    });
});



