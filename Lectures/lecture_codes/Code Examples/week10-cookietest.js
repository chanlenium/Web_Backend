const express = require("express");
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.get("/", (req,res)=>{
    res.header('Set-Cookie', 'helloworld=Hello World'); // append the 'Set-Cookie' header to the response to set a "helloworld" cookie
    res.json({message: "cookie: helloworld set"});
});

app.get("/cookieData",(req,res)=>{
    res.json({cookieData: req.header("cookie")}); // read the (unparsed) value of the incoming "cookie" header
});

app.listen(HTTP_PORT,()=>{
    console.log(`server listening on: ${HTTP_PORT}`);
});