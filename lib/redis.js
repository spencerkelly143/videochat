"use strict"

const redis = require('redis');
const promise = require('bluebird');

const REDIS_HOST = "redis-10770.c228.us-central1-1.gce.cloud.redislabs.com"
const REDIS_PORT = "10770"

promise.promisifyAll(redis.RedisClient.prototype);
promise.promisifyAll(redis.Multi.prototype);

let client = () => {
  return new Promise((resolve, reject) =>{
    let connector = redis.createClient ({
      port : "10770",
      host : "redis-10770.c228.us-central1-1.gce.cloud.redislabs.com",
      password: "wpoTrgg4kiIkZayY4BCNBy5cmxba0bQs"
    });

    connector.on("error", () => {
      reject("Redis Connection Failed");
    })
    connector.on("connect", ()=>{
      resolve(connector);
    })
  })
}

module.exports = client
