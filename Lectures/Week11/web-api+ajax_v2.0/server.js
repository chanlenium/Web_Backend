// // “Fetch API” to make AJAX requests.
// var myRequest = new Request('https://reqres.in/api/users/',{
//    method: 'POST',
//    body: JSON.stringify({user:"John Doe", job:"unknown"}),
//    headers:{
//        'Content-Type': 'application/json'
//    }
// });
// fetch(myRequest).then(function(response){
//     return response.json();
// }).then(function(jsonData){
//     console.log(jsonData);
// });

// // The Fetch API (Compressed)
// fetch('https://reqres.in/api/users/', {
//     method: 'POST',
//     body: JSON.stringify({user:"John Doe", job:"unknown"}),
//     headers:{
//        'Content-Type': 'application/json'
//     }
// })
// .then(response => response.json())
// .then(jsonData => {
//     console.log(jsonData)
// })

// // The Fetch API ("GET" request)
// fetch('https://reqres.in/api/users/')
// .then(response => response.json())
// .then(json => {
//     console.log(json);   
// });

// // Handling Responses with an “Error” Status
// fetch("https://reqres.in/api/unknown/23").then(response =>{
//     return (response.ok) ? response.json() : Promise.reject(reponse.status);
// }).then(jsonData => {
//     console.log(jsonData)
// }).catch(errData => {
//     console.log(errData)
// })

const express = require("express");
const app = express();
const path = require("path");

const bodyParser = require('body-parser');

// dataService = required("./data-service");

const HTTP_PORT = process.env.PORT || 8080;

app.use(bodyParser.json()); // for parsing req.body or req.body.fname,...

// setup a 'route' to listen on the default url path (http://localhost)
app.use(express.static("public"));

app.get("/", (req, res) => {
    //let message = {msg : "Welcome!"};
    //res.json(message);
    res.sendFile(path.join(__dirname, "/public/index.html"));
});


// CRUD operation on User entity

// R - GetAll users
app.get("/api/users", (req, res) => {
    // dataService.getAllUsers().then(data=>{
    //    res.json({message: "fetch all users", data: data})
    //}).catch(...);
    res.json({message: "fetch all users"});
});

// C - Create new user
app.post("/api/users", (req, res) => {
    res.json({message: "add a user", data: req.body});
    //res.json({message: "add a user", firstName: req.body.fname, lastName: req.body.lname});
});

// R - GetOne user
app.get("/api/users/:id", (req, res) => {
    res.json({message: "get user with Id: " + req.params.id});
});

// U - Update a user
app.put("/api/users/:userId", (req, res) => {
    res.json({message: "update User with Id: " + req.params.userId,
    data: req.body});
});

// D - Delete a user
app.delete("/api/users/:userId", (req, res) => {
        res.json({message: "delete User with Id: " + req.params.userId});
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, () => {
    console.log("Express http server listening on: " + HTTP_PORT);
});
