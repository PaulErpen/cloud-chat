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

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

//importing a router
app.use('/', router);

//define global variables
global.main_dir = __dirname;
global.users = new Array();

io.on('connection', function(socket){
  console.log("user is connected");

  socket.on('chat message', function(msg){
    console.log(msg);

    var username = 'USERNAME';
    var currentdate = new Date();
    var timestamp = "Last Sync: "
        + currentdate.getDate() + "/"
        + (currentdate.getMonth()+1)  + "/" // starts with 0
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    io.emit('new-message', {"payload":msg, "timestamp":timestamp, "username":username});
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});