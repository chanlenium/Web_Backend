var express = require('express');
var app = express();
var path = require("path");

// Using handlebars
const exphbs = require('express-handlebars');
app.engine('.hbs', exphbs({ 
    extname: '.hbs',
    helpers:{
        strong: function(options){
            // helper without "context", (ie {{#helper}} ... {{/helper}})
            return '<em>' + options.fn(this) + '</em>'
        },
        list: function(context, options){
            // helper without "context", (ie {{#helper context}} ... {{/helper}})
            var ret = "<ul>";
            for (var i = 0; i < context.length; i++){
                ret = ret + "<li>" + options.fn(context[i]) + "</li>";
            }
            return ret + "</ul>";
        }
    },
    defaultLayout: 'main'
 }));
app.set('view engine', '.hbs');

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart(){
    console.log("Express http server listening on: " + HTTP_PORT);
}

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req, res){
    res.send("Hello World<br/><a href='/about'>Go to the about page</a>");
})

// setup another route to listen on /about
app.get("/about", function(req, res){
    res.sendFile(path.join(__dirname, "/week2-assets/about.html"));
});

// If we want to send JSON data
app.get("/getData", function(req, res){
    var someData = {
        name: "John",
        age: 23,
        occupation: "developer",
        company: "Scotiabank"
    }
    res.json(someData);
})


// viewData with helper function (if, unless)
app.get("/viewData", function(req, res){
    var someData = {
        name: "John",
        age: 23,
        occupation: "developer",
        company: "Scotiabank",
        visible: true,
        contract: false
    }

    res.render('viewData', {
        data: someData,
        //layout: false 
        //commenting layout property out means to use the default Layout (main.hbs)
    })
})


// viewDataEach with helper function (each)
app.get("/viewDataEach", function(req, res){
    var someData = [{
        name: "John",
        age: 23,
        occupation: "developer",
        company: "Scotiabank",
    },
    {
        name: "Sarah",
        age: 32,
        occupation: "manager",
        company: "TD"
    }];

    res.render('viewDataEach', {
        data: someData,
        layout: false // do not use the default Layout (main.hbs)
    })
})



// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);