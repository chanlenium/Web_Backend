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

// Define our "User" and "Task" models
var User = sequelize.define('User', {
    fullName: Sequelize.STRING,
    title: Sequelize.STRING
});

var Task = sequelize.define('Task', {
    title: Sequelize.STRING,
    description: Sequelize.TEXT
});

// Associate Tasks with user & automatically create a foreign key
// relationship on "Task" via an automatically generated "UserId" field
User.hasMany(Task);

sequelize.sync().then(function(){
    // Create user "Jason Bourne"
    User.create({
        fullName: "Jason Bourne",
        title: "developer"
    }).then(function(user){
        console.log("user created");

        // Create "Task1" for the new user
        Task.create({
            title: 'Task 1',
            description: "Task 1 description",
            UserId: user.id // set the correct UserId foreign key
        }).then(function(){console.log("Task 1 created")});

        // Create "Task2" for the new user
        Task.create({
            title: 'Task 2',
            description: "Task 2 description",
            UserId: user.id // set the correct UserId foreign key
        }).then(function(){console.log("Task 2 created")});
    });
});