const client = require("../lib/redis");


client().then(
  res => {
    exports.offer = ({desc, to, from, room}) => {
      res.publish('offers', JSON.stringify({desc, to, from, room}))
    }

    exports.answer = ({desc, to, from, room}) => {
      res.publish('answer', JSON.stringify({desc, to, from, room}))
    }

    exports.IceCandidate = ({desc, to, from, room}) => {
      res.publish('IceCandidate', JSON.stringify({desc, to, from, room}))
    }
  }
)
