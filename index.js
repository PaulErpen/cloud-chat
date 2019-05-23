//determine which environment to use
const node_env = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: '.env.'+node_env});

//import express and initialize server
var express = require('express'); 
var app = express();
var http = require('http').Server(app);
global.io = require('socket.io')(http);
var port = process.env.PORT || 3000;

//import required modules
var path = require('path');
var router = require('./routes/router.js');
var bodyParser = require('body-parser');
var messages = require('./messages/messages');
var cors = require("cors");
var xFrameOptions = require('x-frame-options')
const hsts = require('hsts');

//SAFETY CONFIG START
if(node_env != 'development') {
  //redirect all non http requests to https
  app.use(function (req, res, next) {
    if (req.secure) {
      next();
    } else {
      res.redirect('https://' + req.headers.host + req.url);
    }
  });

  //use HTTP Strict Transport Security middleware
  //in order to force https from now on
  app.use(hsts({
    maxAge: 15768000  // 6 months in seconds
  }));
}

app.enable('trust proxy');

//configure x-frame header
app.use(xFrameOptions());

app.options("*", cors());
//SAFETY CONFIG END

//REQUEST CONFIG START
//Body parser for POST requests
app.use(bodyParser.urlencoded({
  extended: false
}));
// parse application/json
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ACCESS_CONTROL_ALLOW_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

//importing our router
app.use('/', router);
//REQUEST CONFIG END

//AMQP setup
var q = 'chat';
var open = require('amqplib').connect('amqp://zdxlclmp:LsH-3hfJo-tyhiVv9ggB43YUrI9eiEtG@caterpillar.rmq.cloudamqp.com/zdxlclmp');

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


//define global variables, which will be used in other modules
global.main_dir = __dirname;
global.users = new Array();
global.online_user_names = [];
global.online_user_sockets = new Array();

//configure the sockets for the real time chat
io.on('connection', function(socket){

  messages.sendAvailableLanguages();

  socket.on('chat login', function(data) {
    if(!online_user_names.includes(data.username)) {
      online_user_names.push(data.username);
    }
    online_user_sockets[data.username] = {"socket": socket, "username": data.username};

    io.emit('user update', {"users": online_user_names});
    messages.sendServerMessage(data.message);
  });

  socket.on('chat logout', function(data) {
    online_user_names = online_user_names.filter(u => u != data.username);

    online_user_sockets = Object.keys(online_user_sockets)
      .filter(u => u != data.username)
      .reduce((obj, key) => {
        obj[key] = online_user_sockets[key];
        return obj;
      }, {}
    );

    io.emit('user update', {"users": online_user_names});
    messages.sendServerMessage(data.message);
  });

  socket.on('chat broadcast', function(data){
    messages.sendBroadcast(data);
  });

  socket.on('chat message', function(data){
    messages.sendMessage(data);
  });

  socket.on('file broadcast', function(data){
    messages.sendFileBroadcast(data);
  });

  socket.on('file message', function(data){
    messages.sendFileMessage(data);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});