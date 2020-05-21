"use strict"

const client = require("../lib/redis");


exports.fetchMessages = (client) => {
  return new Promise((resolve, reject) => {
      client.lrangeAsync("messages", 0, -1).then(
        messages => {
          resolve(messages);
        },
        err => {
          reject(err);
        }
      )
  });
};

exports.addMessage = (client, message) =>{
  return new Promise((resolve, reject) => {
        client
          .multi()
          .rpush("messages", message)
          .execAsync()
          .then(
            res => {
              resolve(res);
            },
            err => {
              reject(err);
            }
          )
  })
}

exports.fetchActiveUsers = (client) => {
  console.log("function")
  console.log(typeof client)
  return new Promise((resolve, reject) => {
              client.smembersAsync("users").then(
                  users => {
                    console.log("hh");
                      resolve(users);
                  },
                  err => {
                      reject(err);
                  }
              );
  });
}

exports.addActiveUser = (client, user) => {
  return new Promise((resolve,reject)=>{
      client
        .multi()
        .sadd("users",user)
        .execAsync()
        .then(
          res => {
            if(res[0] === 1){
              resolve(res)
            }
            reject("User already in list")
          },
          err => {
            reject(err)
          }
      )
  })
}

exports.removeActiveUser = (client, user) => {
  return new Promise((resolve,reject)=>{
        client
          .multi()
          .srem("users",user)
          .execAsync()
          .then(
            res => {
              if(res[0] === 1){
                resolve("User removed")
              }
              reject("User not in list")
            },
            err => {
              reject(err)
            }
        )
  })
}
