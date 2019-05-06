const node_env = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: '.env.'+node_env});
var express = require('express'); 
var app = express();
var http = require('http').Server(app);
global.io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var path = require('path');
var router = require('./routes/router.js');
var bodyParser = require('body-parser');
var messages = require('./messages/messages');
var cors = require("cors");
var xFrameOptions = require('x-frame-options')
const hsts = require('hsts')

//joining paths in order to serve public files
app.use(express.static(path.join(__dirname, 'public')));

if(node_env != 'development') {
  //block all non https requests
  app.use (function (req, res, next) {
    if (req.headers && req.headers.$wssc === "https")
        {
         next();
     } else {
         res.status(403).send();
     }
 });

 //use HTTP Strict Transport Security middleware
  //in order to force https from now on
  app.use(hsts({
    maxAge: 604800  // 7 days in seconds
  }))
}

//configure x-frame header
app.use(xFrameOptions());

app.options("*", cors());
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

//importing a router
app.use('/', router);

//define global variables
global.main_dir = __dirname;
global.users = new Array();
global.online_user_names = [];
global.online_user_sockets = new Array();

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