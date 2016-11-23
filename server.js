var express = require("express");
var app = express();
var port = process.env.PORT || 8080;

app.get("/", using);

app.listen(port, running);

function running(){
    console.log("App is running on port "+port+"!");
}

function using(req, res){
    res.send("teszt");
}