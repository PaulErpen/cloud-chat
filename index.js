var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

//define global users
users = new Array();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/login', function(req, res){
  var username = req.query.username;
  if(users.includes(username)) {
    res.sendFile(__dirname + '/index.html?failed');
  } else {
    users.push(username);
    res.sendFile(__dirname + '/chat.html');
  }
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
