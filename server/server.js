"use strict"

const express = require('express');
const bodyParser =require("body-parser");
const socket = require("socket.io");
const path = require("path");
const client = require("../lib/redis");
const routes = require("./routes");
const cors = require("cors")
const events = require("./events.js")

const PORT = "5000"
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
let socketConnectionCounter = 0;
client().then(
  res => {
    app.get("/users", routes.users);
    app.get("/messages", routes.messages);
    app.post("/user", routes.createUser);
    app.delete("/user", routes.deleteUser);
    app.post("/message", routes.createMessage);

    const server = app.listen(PORT, () => {
      console.log("Server Started")
    })
    const io = socket.listen(server)
    io.origins('*:*');
    io.on("connection", socket => {

      res.subscribe("chatMessages");
      res.subscribe("activeUsers");
      res.subscribe("offers");
      res.subscribe("answers");
      res.subscribe("IceCandidates")

      console.log("socket connections: ", socketConnectionCounter)

      socket.on('PCSignalingOffer', ({desc, to, from, room}) => {
        events.offer({desc, to, from, room})
      })
      socket.on('PCSignalingAnswer', ({desc, to, from, room}) => {
        events.answer({desc, to, from, room})
      })
      socket.on('IceCandidate', ({candidate, to, from, room}) =>{
        events.IceCandidate({candidate, to, from, room})
      })


      res.on("message", (channel, message) => {
        console.log(channel)
        if (channel === "chatMessages"){
          socket.emit("message", JSON.parse(message))
        } else if(channel === "activeUsers")  {
          socket.emit("", JSON.parse(message))
        }else if(channel === "offers")  {
          socket.emit('PCSignalingOffer', JSON.parse(message))
        }else if(channel === "answers")  {
          socket.emit('PCSignalingAnswer', JSON.parse(message))
        }else if (channel === 'IceCandidates') {
          socket.emit('IceCandidate', {candidate, to, from, room})
        }
      })
    })
    io.on('connect', function() { socketConnectionCounter++; });

    io.on('disconnect', function() { socketConnectionCounter--; });

  },
  err => {
    console.log("Redis connection failed: " + err)
  }
)
