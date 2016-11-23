var express = require("express");
var app = express();
var port = process.env.PORT || 8080;
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var url = process.env.MONGOLAB_URI;      




app.get("/", using);

app.listen(port, running);

function running(){
    console.log("App is running on port "+port+"!");
}

function using(req, res){
    var result;
    MongoClient.connect(url, function (err, db) {
      if (err) {
        result = "Unable to connect to the mongoDB server. Error: " + err;
      } else {
        result = "Connection established to " + url;
        db.close();
      }
    });
    res.send(result);
}
