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

const node_env = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: '.env.'+node_env});
console.log(process.env.ACCESS_CONTROL_ALLOW_ORIGIN);

//joining paths in order to serve public files
app.use(express.static(path.join(__dirname, 'public')));

app.options("*", cors());
//Body parser for POST requests
app.use(bodyParser.urlencoded({
  extended: false
}));
// parse application/json
app.use(bodyParser.json())

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ACCESS_CONTROL_ALLOW_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
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
  socket.on('chat login', function(data) {
    if(!online_user_names.includes(data.username)) {
      online_user_names.push(data.username);
    }
    online_user_sockets[data.username] = {"socket": socket, "username": data.username};

    io.emit('user update', {"users": online_user_names});
    io.emit('new message',{"payload": data.message, "type": "server"});
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
    io.emit('new message',{"payload":data.message, "type":"server"});
  });

  socket.on('chat broadcast', function(data){
    messages.sendBroadcast(data);
  });

  socket.on('chat message', function(data){
    messages.sendMessage(data);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});