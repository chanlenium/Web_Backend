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

// Define a "Project" model
var Project = sequelize.define('Project', {
    project_id:{
        type: Sequelize.INTEGER,
        primaryKey: true,   // use "project_id" as a primary key
        autoIncrement: true // automatically increment the value
    },
    title: Sequelize.STRING,
    description: Sequelize.TEXT
},{
    createdAt: false,   // disable createdAt
    updatedAt: false    // disable updatedAt
});

// Synchronize the Database with our models and automatically add the table
// if it does not exist
sequelize.sync().then(function(){
    //create a new "Project" and add it to the database
    Project.create({
        title: 'Project1',
        description: 'First Project'
    }).then(function (project) {
        // you can now access the newly created Project via the variable project
        console.log("success!")
    }).catch(function (error) {
        console.log("something went wrong!");
    });
});




// sequelize.authenticate()
// .then(function(){
//     console.log('Connection has been established successfully')
// })
// .catch(function(err){
//     console.log('Unable to connect to the database:', err)
// })