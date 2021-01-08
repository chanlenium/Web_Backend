const express = require("express");
const app = express();
const path = require("path");

const bodyParser = require('body-parser');

// dataService = required("./data-service");

const HTTP_PORT = process.env.PORT || 8080;

app.use(bodyParser.json()); // for parsing req.body or req.body.fname,...

// setup a 'route' to listen on the default url path (http://localhost)
app.use(express.static("public"));
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "/public/index.html"));
// });


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
    // res.json({message: "add a user", firstName: req.body.fname, lastName: req.body.lname});
});

// R - GetOne user
app.get("/api/users/:id", (req, res) => {
    res.json({message: "get user with Id: " + req.params.id});
});

// U - Update a user
app.put("/api/users/:userId", (req, res) => {
    res.json({message: "update User with Id: " + req.params.userId});
});

// D - Delete a user
app.delete("/api/users/:userId", (req, res) => {
        res.json({message: "delete User with Id: " + req.params.userId});
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, () => {
    console.log("Express http server listening on: " + HTTP_PORT);
});
