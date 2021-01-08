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

// Define a "Name" model
var Name = sequelize.define('Name', {
    fName: Sequelize.STRING, // first Name
    lName: Sequelize.STRING  // last Name
})

// Create
sequelize.sync().then(function(){
    Name.create({
        fName: "Kyler",
        lName: "Odin"
    }).then(function(){console.log("Kyler Odin created")});

    Name.create({
        fName: "Grier",
        lName: "Garrick"
    }).then(function(){ console.log("Grier Garrick created")});

    Name.create({
        fName: "Kolby",
        lName: "Greyson"
    }).then(function(){ console.log("Kolby Greyson created")});
})


// Read
sequelize.sync().then(function(){
    // return all first names only
    Name.findAll({
        attributes: ['fName']
    }).then(function(data){
        // pull the data (exclusively)
        // This is to ensure that our “data” object contains the returned data (only) and nothing else.
        data = data.map(value => value.dataValues);
        
        console.log("All first name");
        for(var i = 0; i < data.length; i++){
            console.log(data[i].fName);
        }
    });


    // return all first names where id == 2
    Name.findAll({ 
        attributes: ['fName'],
        where: {
            id: 2
        }
    }).then(function(data){
        // pull the data (exclusively)
        data = data.map(value => value.dataValues);

        console.log("All first names where id == 2");
        for(var i =0; i < data.length; i++){
            console.log(data[i].fName);
        }
    });
})


// Update
sequelize.sync().then(function(){
    // update User 2's last name to "James"
    // NOTE: this also updates the "updatedAt field"
    Name.update({
        lName: "James"
    },{
        where: {id: 2}
    }).then(function(){
        console.log("successfully updated user 2");
    });
});



// delete
sequelize.sync().then(function () {
    // remove User 3 from the database
    Name.destroy({
         where: {id: 3}
    }).then(function(){console.log("successfully removed user 3");});
})