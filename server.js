var express = require("express");
var app = express();
var port = process.env.PORT || 8080;
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var url = process.env.MONGOLAB_URI;      

var regexpForURL = /^http(?:s)?:\/\/(?:\w+\.)+(?:\w{2,})\/?$/;
var regexpForShortURL = /^\d+$/;

app.set("view engine", "pug");
app.set("views", __dirname +"/views");
app.get("/", usage);
app.get("*", parseURL);

app.listen(port, running);

function running(){
    console.log("App is running on port "+port+"!");
}
function usage(req, res){
    res.render('index', { protocol: req.protocol, url: req.hostname });
}

function newURL(req, res, param){
  MongoClient.connect(url, function (err, db) {
    if (err) {
      res.status(500).send("Unable to connect to the mongoDB server. Error: " + err)
    } else {
      var collection = db.collection("url");
      collection.count(function(err, c) {
        if (err){
          res.status(500).send("Can't count. Error: " + err)
        }
        else {
          insertNewURL(req, res, param, c+1, db, collection);
        }
      });
      
    }
  });
}

function shortURL(req, res, param){
  MongoClient.connect(url, function (err, db) {
    if (err) {
      res.status(500).send("Unable to connect to the mongoDB server. Error: " + err)
    } else {
      var documentToFind = {_id: parseInt(param)};
      var collection = db.collection("url");
      collection.find(documentToFind).toArray(function(err, documents) {
        if (err){
          res.status(500).send("Can't find. Error: " + err)
        }
        else {
          if (documents.length === 1){
            res.redirect(documents[0].url);
          }
          else {
            res.json({error:"This url is not in the database."});
          }
        }
      });
      db.close();
    }
  });
}

function parseURL (req, res){
  var param = decodeURI(req.path.substring(1));
  if (regexpForURL.test(param)){
    newURL(req, res, param);
  }
  else if (regexpForShortURL.test(param)){
    shortURL(req, res, param);
  }
  else {
    res.json({error:"Invalid URL format!"});
  }
}

function insertNewURL(req, res, param, id, db, collection){
  var newDocument = {_id: id, url: param};
  collection.insert(newDocument, function(err, data){
    if (err){
      res.status(500).send("Insert error: "+err);
    }
    else {
      res.status(200).send({originalURL:param, shortURL:req.protocol+"://"+req.hostname+"/"+id});
    }
  })
  db.close();
}