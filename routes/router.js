const express = require('express');
const router = express.Router();
const userimage = new require('../database/userimage');
const auth = new require('../database/authentication');
const database = require("../database/database");
const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * Checks if Parameters are undefined
 * Passes login request on to user login function and sends back result
 */
router.post('/login', function(req, res){
  if((req.body.username == undefined && 
  req.body.password == undefined)) {
      res.send(false);
  } else {
    handleLogin(req.body.username, req.body.password, res);
  } 
});

/**
 * Checks if Parameters are undefined
 * Passes register request on to user register function and sends back result
 */
router.post('/register', function(req, res){
  if(
      req.body.username == undefined ||
      req.body.password == undefined ||
      req.body.profilepic == undefined ||
      req.body.language == undefined
    ) {
    res.send(false);
  } else {
    handleRegister(
      req.body.username, 
      req.body.password, 
      req.body.profilepic, 
      req.body.language, res
    );
  }
});

router.post('/userimage', function(req, res){
  if(
    req.body.username == undefined
    ) {
    res.send(false);
  } else {
    userimage.getUserImage(req.body.username).then(
      function(result) {
        if(result[0].rows[0] != undefined && result[0].rows[0][0] != undefined) {
          res.send({
            "image": database.cleanString(result[0].rows[0][0]),
            "username": req.body.username
          });
        } else {
          res.send({
            "image": "",
            "username": req.body.username
          });
        }
      }
    );
  }
});

function handleLogin(username, password, res) {
  auth.login(username).then(
    function(result) {
      if(result.length == 0 || result[0].rows.length == 0 || result[0].rows[0].length == 0) {
        res.send({"result": false});
      }else {
        var hashedPassword = database.cleanString(result[0].rows[0][0]);
        bcrypt.compare(password, hashedPassword).then((result) => {
            res.send({"result": result});
        });
      }
    }
  );
}

function handleRegister(username, password, profilepic, language, res) {
  bcrypt.hash(password, saltRounds, function(error, hash) {
    if(error) {
      res.send({"result":false});
    } else {
      auth.register(username, hash, profilepic, language).then(
        (result) => {
          if(result) {
            handleLogin(username, password, res);
          } else {
            res.send({"result":false});
          }
        }
      )
    }
  });
}

module.exports = router;