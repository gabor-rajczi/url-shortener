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
    MongoClient.connect(url, function (err, db) {
      if (err) {
        res.status(500).send("Unable to connect to the mongoDB server. Error: " + err)
      } else {
        var collection = db.collection("url");
        var count = collection.count(function(err, c) {
          if (err){
            res.status(500).send("Can't count. Error: " + err)
          }
          else {
            res.status(200).send("Connection established. The 'url' connection has "+c+" document(s).");
          }
        });
        db.close();
      }
    });
}
