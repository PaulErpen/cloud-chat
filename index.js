var express = require('express'); 
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var router = require('./routes/router.js');
var path = require('path');
const bodyParser = require("body-parser");

//joining paths in order to serve public files
app.use(express.static(path.join(__dirname, 'public')));

//
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

//define global variables
global.main_dir = __dirname;
global.users = new Array();

app.use('/', router);

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    // io.emit('chat message', msg);

    var username = 'USERNAME';
    var currentdate = new Date();
    var timestamp = "Last Sync: "
        + currentdate.getDate() + "/"
        + (currentdate.getMonth()+1)  + "/" // starts with 0
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    io.emit('new_message', msg, timestamp, username);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});