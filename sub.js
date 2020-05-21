var redis = require('redis');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})


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

client.publish("notification", "hello", function(){
  console.log("sent")
})

client.on("message", function (channel, message) {
 console.log("Message: " + message + " on channel: " + channel + " is arrive!");
});
client.subscribe("notification");
