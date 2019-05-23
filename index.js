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
var mqlight = require('mqlight');

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

/*configuration of MQ on IBM Cloud in order
to make inter-service communication possible*/
var mq_options = {};
if(process.env.VCAP_SERVICES) {
  var services = JSON.parse(process.env.VCAP_SERVICES);
  console.log('Running BlueMix');
  for (var key in services) {
    if (key.lastIndexOf(mqlightServiceName, 0) === 0) {
      mqlightService = services[key][0];
      mq_options.service = mqlightService.credentials.nonTLSConnectionLookupURI;
      mq_options.user = mqlightService.credentials.username;
      mq_options.password = mqlightService.credentials.password;
    } else if (key.lastIndexOf(messageHubServiceName, 0) === 0) {
      messageHubService = services[key][0];
      mq_options.service = messageHubService.credentials.mqlight_lookup_url;
      mq_options.user = messageHubService.credentials.user;
      mq_options.password = messageHubService.credentials.password;
    }
  }
  if (!mq_options.hasOwnProperty('service') ||
      !mq_options.hasOwnProperty('user') ||
      !mq_options.hasOwnProperty('password')) {
    throw 'Error - Check that app is bound to service';
  }
} else {
  mq_options.service = process.env.MQ_LIGHT_SERVICE;
  mq_options.user = process.env.MQ_LIGHT_USER;
  mq_options.password = process.env.MQ_LIGHT_PASSWORD;
}
var sendClient = mqlight.createClient(mq_options, function (err) {
  if (err) {
    console.error('Connection to ' + mq_options.service + ' using client-id ' +
    sendClient.id + ' failed: ' + err)
  } else {
    console.log('Connected to ' + mq_options.service + ' using client-id ' +
    sendClient.id)
  }
});
var topic = '';
sendClient.on('started', function() {
  sendClient.send(topic, 'Hello World!', function (err, data) {
    console.log('Sent: %s', data);
    sendClient.stop();
  });
});

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