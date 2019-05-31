//determine which environment to use
const node_env = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: '.env.'+node_env});

//import express and initialize server
var express = require('express'); 
var app = express();
var http = require('http').Server(app);
global.io = require('socket.io')(http, {'transports': ['websocket', 'polling']});
var port = process.env.PORT || 3000;

console.log("this is my port "+port);

//import required modules
var path = require('path');
var router = require('./routes/router.js');
var bodyParser = require('body-parser');
var messages = require('./messages/messages');
var usermanager = require('./usermanager/usermanager');
var cors = require("cors");
var xFrameOptions = require('x-frame-options')
const hsts = require('hsts');
const messagebroker = require("./messagebroker/messagebroker");

app.enable('trust proxy');

//experimental
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');

if(node_env != 'development') {
  var Db2Store = require('connect-db2')(expressSession);

  var options = {
    host: 'dashdb-txn-sbox-yp-lon02-02.services.eu-gb.bluemix.net',
    port: 50000,
    username: 'vxc32889',
    password: 'lf4t3w-546qv5d11',
    database: 'VXC32889'
  };
  
  var sessionStore = new Db2Store(options);
} else {
  var sessionStore = new expressSession.MemoryStore();  
}


app.use(cookieParser());

var session = expressSession({
  name : 'JSESSIONID',
  secret: "1234567890QWERTY",
  resave: true,
  store: sessionStore,
  saveUninitialized: true,
  cookie: {
    httpOnly: false //set to false in order to check existance on the client side
  }
});

app.use(session);

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

// app.use(function(req, res, next) {
//   res.setHeader(200,{'Set-Cookie' : 'JSESSIONID=', 'Content-Type' : 'text/plain'});
//   next();
// });

//importing our router
app.use('/', router);
//REQUEST CONFIG END

//define global variables, which will be used in other modules
global.main_dir = __dirname;
global.users = new Array();
global.online_user_names = [];
global.online_user_sockets = new Array();

messagebroker.setupQueueListener();


//EXPERIMENTAL
var socketIOExpressSession = require('socket.io-express-session'); 
io.use(socketIOExpressSession(session)); // session support

// var SessionSockets = require('session.socket.io');
// var sessionSockets = new SessionSockets(io, RedisStore, cookieParser, 'jsessionid');

//configure the sockets for the real time chat
io.on('connection', function(socket){

  messages.sendAvailableLanguages();

  socket.on('chat signup', function(data) {
    debugger;
  });

  socket.on('chat login', function(data) {
    usermanager.userLogin(data.username, socket).then(
      (msg) => {
        messages.sendServerMessage(msg);
      }
    );
    messagebroker.notifyUserLogin(data.username);
  });

  socket.on('chat broadcast', function(data){
    messages.sendBroadcast(data);
    messagebroker.notifyUserMessage(data, "broadcast");
  });

  socket.on('chat message', function(data){
    messages.sendMessage(data);
    messagebroker.notifyUserMessage(data, "message");
  });

  socket.on('file broadcast', function(data){
    messages.sendFileBroadcast(data);
    messagebroker.notifyUserMessage(data, "filebroadcast");
  });

  socket.on('file message', function(data){
    messages.sendFileMessage(data);
    messagebroker.notifyUserMessage(data, "filemessage");
  });

  socket.on('disconnect', function() {
    usermanager.logoutOnDisconnect(socket).then((msg) => {
      messages.sendServerMessage(msg);
    });
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});