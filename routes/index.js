const express = require('express');

const router = express.Router();

router.get('/', function(req, res){
  res.sendFile(main_dir + '/index.html');
});

router.get('/login', function(req, res){
  var username = req.query.username;
  if(users.includes(username)) {
    res.sendFile(main_dir + '/index.html');
  } else {
    users.push(username);
    res.sendFile(main_dir + '/chat.html');
  }
});

module.exports = router;