'use strict';
const express = require('express');
const client = require("../lib/redis");
const helper = require("../lib/functions")

const router = express.Router()
client().then(client => {

  let fetchMessages = (client) => {
      return helper.fetchMessages(client).then(
          res => {
              return res;
          },
          err => {
              console.log(err);
          }
      );
  };

  let fetchUsers = (client) => {
    console.log('in function')
    console.log(typeof client)
      return helper.fetchActiveUsers(client).then(
          res => {
              console.log("returning")
              console.log(res)
              return res;
          },
          err => {
              console.log(err);
          }
      );
  };


  exports.messages = router.get("/messages", (req,res) => {
    fetchMessages(client).then(messages => {
      res.send(messages)
    }, err => {
      console.log(err)
    })
  })

  exports.users = router.get("/users", (req,res) => {
    fetchUsers(client).then(u => {
      res.send(u)
    }, err => {
      console.log(err)
    })
  })

  exports.createUser = router.post("/user", (req,res) => {
    let users;
    console.log(req.body)
    let user = req.body.user;
    console.log(typeof client)
    fetchUsers(client).then(u =>{
      users = u;
      if(users.indexOf(user)===-1){
        helper.addActiveUser(client, user).then(
          () => {
                console.log("yello")
                let msg = {message: req.body.user + " has been added to the chat room", user: "system"}
                client.publish("chatMessages", JSON.stringify(msg));

                console.log("users")
                console.log(typeof client)
                fetchUsers(client).then(u => {client.publish("activeUsers", JSON.stringify(u));})
                helper.addMessage(client, JSON.stringify(msg)).then(() =>{
                  res.send({
                    status: 200,
                    message: "User joined"
                  });
                },
                  err => {
                    console.log(err)
                  }
              );
          },
          err => {
            console.log(err)
          }
        )
      } else {
        res.send({status: 403, message:"User already exists"})
      }
    })
  })

  exports.deleteUser = router.delete("/user", (req, res) => {
      let users;
      let user = req.body.user;

      fetchUsers(client).then(u => {
          users = u;

          if (users.indexOf(user) !== -1) {
              helper.removeActiveUser(client, user).then(
                  () => {
                          let msg = {
                              message: req.body.user + " just left the chat room",
                              user: "system"
                          };

                          client.publish("chatMessages", JSON.stringify(msg));
                          client.publish(
                              "activeUsers",
                              JSON.stringify(fetchUsers(client))
                          );

                          helper.addMessage(client, JSON.stringify(msg)).then(
                              () => {
                                  res.send({
                                      status: 200,
                                      message: "User removed"
                                  });
                              },
                              err => {
                                  console.log(err);
                              }
                          );
                  },
                  err => {
                      console.log(err);
                  }
              );
          } else {
              res.send({ status: 403, message: "User does not exist" });
          }
      });
  });

  exports.createMessage = router.post("/message", (req, res) => {
      let msg = {
          message: req.body.message,
          user: req.body.user
      };
        client.publish("chatMessages", JSON.stringify(msg));

        helper.addMessage(client, JSON.stringify(msg)).then(
            () => {
                res.send({
                    status: 200,
                    message: "Message sent"
                });
            },
            err => {
                console.log(err);
            }
        );
  });

})
