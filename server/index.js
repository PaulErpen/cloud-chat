var express = require('express'); 
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var path = require('path');
var router = require('./routes/router.js');
var bodyParser = require('body-parser');
var ss = require('socket.io-stream');

//joining paths in order to serve public files
app.use(express.static(path.join(__dirname, 'public')));

//Body parser for POST requests
app.use(bodyParser.urlencoded({
  extended: false
}));
// parse application/json
app.use(bodyParser.json())

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
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
    io.emit('new-message',{"payload": data.message, "type": "server"});
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
    io.emit('new-message',{"payload":data.message, "type":"server"});
  });

  socket.on('chat broadcast', function(data){
    var msg = data.message;
    var username = data.username;
    var currentdate = new Date();
    var timestamp = currentdate.getDate() + "."
        + currentdate.getMonth() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    io.emit('new broadcast', {"payload":msg, "timestamp":timestamp, "username":username, "type":"broadcast"});
  });

  socket.on('chat message', function(data){
    var msg = data.message;
    var currentdate = new Date();
    var timestamp = currentdate.getDate() + "."
        + currentdate.getMonth() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    for(var i = 0; i < data.selectedUsers.length; i++) {
      var username = data.selectedUsers[i];
      online_user_sockets[username].socket.emit('new message',
        {"payload":msg, 
        "timestamp":timestamp, 
        "username":data.username, 
        "type":"message",
        "users": data.selectedUsers
      });
    }
  });

  ss(socket).on('file broadcast', function(stream, data) {
    var filename = path.basename(data.name);
    var file = stream.pipe(fs.createWriteStream(filename));
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});