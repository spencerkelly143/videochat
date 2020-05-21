"use strict"

const express = require('express');
const bodyParser =require("body-parser");
const socket = require("socket.io");
const path = require("path");
const client = require("../lib/redis");
const routes = require("./routes");
const cors = require("cors")

const PORT = "5000"
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

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

      res.on("message", (channel, message) => {
        if (channel === "chatMessages"){
          socket.emit("message", JSON.parse(message))
        } else {
          socket.emit("users", JSON.parse(message))
        }
      })
    })
  },
  err => {
    console.log("Redis connection failed: " + err)
  }
)
