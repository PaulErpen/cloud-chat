//AMQP setup
const q = 'chat';
const open = require('amqplib').connect(env.process.AMQP_URL);
const usermanager = require("../usermanager/usermanager");
const uuidv4 = require('uuid/v4');
const instanceBrokerID = uuidv4();

function setupQueueListener() {
  // Consumer
  open.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    return ch.assertQueue(q).then(function(ok) {
      return ch.consume(q, function(msg) {
        if (msg !== null) {
          //deal with the message
          handleQueueMessage(msg);

          //acknowledge that we consumed the message
          ch.ack(msg);
        }
      });
    });
  }).catch(console.warn);
}

function notifyUserLogin(username) {
  // publish login info to queue
  open.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    return ch.assertQueue(q).then(function(ok) {
      return ch.sendToQueue(q, Buffer.from(
        JSON.stringify({
          "instanceid": instanceBrokerID,
          "type": "userupdate",
          "action": "login",
          "username": username
        })));
    });
  }).catch(console.warn);
}

function notifyUserLogout(username) {
  // publish login info to queue
  open.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    return ch.assertQueue(q).then(function(ok) {
      return ch.sendToQueue(q, Buffer.from(
        JSON.stringify({
          "instanceid": instanceBrokerID,
          "type": "userupdate",
          "action": "logout",
          "username": username
        })));
    });
  }).catch(console.warn);
}

function notifyUserMessage() {
  //TODO
}

function handleQueueMessage(message) {
  message = JSON.parse(message);

  if(message.instanceid != instanceBrokerID) {
    switch (message.type) {
      case "userupdate":
        handleUserUpdate(message);
        break;
      case "message":
        handleQueueMessage(message);
        break;
    }
  }
}

function handleUserUpdate(message) {
  switch (message.action) {
    case "login":
      usermanager.loginRemoteUser(message.username);
      break;
    case "logout":
      usermanager.logoutRemoteUser(message.username);
      break;
  }
}

function handleQueueMessage(message) {

}

// Publisher
open.then(function(conn) {
  return conn.createChannel();
}).then(function(ch) {
  return ch.assertQueue(q).then(function(ok) {
    return ch.sendToQueue(q, Buffer.from('something to do'));
  });
}).catch(console.warn);

// Consumer
open.then(function(conn) {
  return conn.createChannel();
}).then(function(ch) {
  return ch.assertQueue(q).then(function(ok) {
    return ch.consume(q, function(msg) {
      if (msg !== null) {
        console.log(msg.content.toString());
        ch.ack(msg);
      }
    });
  });
}).catch(console.warn);

module.exports = {
  "setupQueueListener": setupQueueListener,
  "notifyUserLogin": notifyUserLogin,
  "notifyUserLogout": notifyUserLogout,
  "notifyUserMessage": notifyUserMessage
}