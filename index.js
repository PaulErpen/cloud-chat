var express = require('express'); 
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var router = require('./routes/index.js');
var path = require('path');

//joining paths in order to serve files
app.use(express.static(path.join(__dirname, 'public')));

//define global variables
global.main_dir = __dirname;
global.users = new Array();

app.use('/', router);

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});