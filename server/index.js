var express = require('express'); 
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var path = require('path');
var router = require('./routes/router.js');
var bodyParser = require('body-parser');

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
// global.online_user = 0;
global.online_user = new Array();

io.on('connection', function(socket){
  console.log("user is connected");

  online_user = [{"username":"Hallo"}, {"username":"Test1"}];
  online_user.push({"username":"Test2"});
  io.emit('online users', online_user);

  socket.on('chat servermessage', function(data) {
    io.emit('new-message',{"payload":data, "type":"server"});
  });

  socket.on('chat message', function(data){
    var msg = data.message;
    var username = data.username;
    var currentdate = new Date();
    var timestamp = "Last Sync: "
        + currentdate.getDate() + "/"
        + (currentdate.getMonth()+1)  + "/" // starts with 0
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    io.emit('new-message', {"payload":msg, "timestamp":timestamp, "username":username, "type":"user"});
  });
  
  socket.on('disconnect', function () {
    console.log("user disconnected");
  })
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});