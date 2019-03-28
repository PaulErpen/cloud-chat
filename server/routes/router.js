const express = require('express');
const user = require('../user/user');

const router = express.Router();

router.get('/', function(req, res){
  res.sendFile(main_dir + '/login.html');
});

router.get('/chat', function(req, res){
  res.sendFile(main_dir + '/chat.html');
});

router.get('/login', function(req, res){
  res.sendFile(main_dir + '/login.html');
});

//routes for login
router.post('/login', function(req, res) {
  if((req.body.username != undefined && 
    req.body.password != undefined)) {
    res.sendFile(main_dir + '/login.html');
  }

  new Promise(function(resolve, reject) {
    resolve(user.login(req.body.username, req.body.password));
  }).then(
    function(result) {
      if(result) {
        res.redirect('/chat');
      }
    }
  );
});

//routes for register
router.get('/register', function(req, res){
  res.sendFile(main_dir + '/register.html');
});

router.post('/register', function(req, res) {
  if(req.body != undefined &&
    req.body.username != undefined && 
    req.body.password != undefined) {
    res.sendFile(main_dir + '/register.html');
  }

  new Promise(function(resolve, reject) {
    resolve(user.register(req.body.username, req.body.password));
  }).then(
    function(result) {
      if(result) {
        res.redirect("/chat");
      }
    }
  );
});

module.exports = router;