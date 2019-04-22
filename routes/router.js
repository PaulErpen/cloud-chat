const express = require('express');
const router = express.Router();
const authentication = new require('../authentication/authentication');
const auth = new authentication();
const fs = require('fs');
var path = require('path');
var messages = require("../messages/messages");

/**
 * Checks if Parameters are undefined
 * Passes login request on to user login function and sends back result
 */
router.post('/login', function(req, res){
  if((req.body.username == undefined && 
  req.body.password == undefined)) {
      res.send(false);
  } else {
    auth.login(req.body.username, req.body.password).then(
      function(result) {
        res.send(false);
      }
    );
  } 
});

/**
 * Checks if Parameters are undefined
 * Passes register request on to user register function and sends back result
 */
router.post('/register', function(req, res){
  if(
    req.body.username == undefined || 
    req.body.password == undefined
    ) {
    res.send(false);
  } else {
    auth.register(req.body.username, req.body.password).then(
      function(result) {
        res.send(false);
      }
    );
  }
});

module.exports = router;