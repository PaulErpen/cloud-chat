//AMQP setup
const q = 'chat';
const open = require('amqplib').connect(process.env.AMQP_URL);
const usermanager = require("../usermanager/usermanager");
const uuidv4 = require('uuid/v4');
const instanceBrokerID = uuidv4();
const messages = require('../messages/messages');

function setupQueueListener() {
  // Consumer
  open.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    return ch.assertQueue(q).then(function(ok) {
      return ch.consume(q, function(msg) {
        if (msg !== null) {
          //deal with the message
          handleQueueMessage(msg.content.toString());

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

function notifyUserMessage(data, action) {
  // publish message info to queue
  open.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    return ch.assertQueue(q).then(function(ok) {
      return ch.sendToQueue(q, Buffer.from(
        JSON.stringify({
          "instanceid": instanceBrokerID,
          "type": "message",
          "action": action,
          "data": data
        })));
    });
  }).catch(console.warn);
}

function handleQueueMessage(message) {
  try {
    message = JSON.parse(message);

    /**
     * only handly messages tat arent ours
     */
    if(message.instanceid != instanceBrokerID) {
      switch (message.type) {
        case "userupdate":
          handleUserUpdate(message);
          break;
        case "message":
        handleMessageData(message);
          break;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

function handleUserUpdate(message) {
  switch (message.action) {
    case "login":
      usermanager.loginRemoteUser(message.username).then((msg) => {
        messages.sendServerMessage(msg);
      });
      break;
    case "logout":
      usermanager.logoutRemoteUser(message.username).then((msg) => {
        messages.sendServerMessage(msg);
      });;
      break;
  }
}

function handleMessageData(message) {
  switch (message.action) {
    case "message":
      messages.sendMessage(message.data);
      break;
    case "broadcast":
      messages.sendBroadcast(message.data);
      break;
    case "filemessage":
      messages.sendFileMessage(message.data);
      break;
    case "filebroadcast":
      messages.sendFileBroadcast(message.data);
      break;
  }
}

module.exports = {
  "setupQueueListener": setupQueueListener,
  "notifyUserLogin": notifyUserLogin,
  "notifyUserLogout": notifyUserLogout,
  "notifyUserMessage": notifyUserMessage
}