var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var fs = require('fs');
var creds = '';

var redis = require('redis');
var client = '';
var port = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

http.listen(port, function() {
    console.log('Server Started. Listening on *:' + port);
});

// Read credentials from JSON
client = redis.createClient ({
  port : "10770",
  host : "redis-10770.c228.us-central1-1.gce.cloud.redislabs.com"
});

client.auth("wpoTrgg4kiIkZayY4BCNBy5cmxba0bQs", function(err, response){
  if(err){
  throw err;
  }
});

client.once("connect", function(err,res){
  console.log("connect")
})

client.publish("notification", "Hello world from Asgardian!", function(){
  process.exit(0)
})
