const express = require('express');
const router = express.Router();
const authentication = new require('../database/authentication');
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
        res.send({"result":result[0].rows_count>0});
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
      (result) => {
        if(result != false) {
          auth.login(req.body.username, req.body.password).then(
            function(result) {
              res.send({"result":result[0].rows_count>0});
            }
          );
        }
      }
    )
  }
});

router.post('/userimage', function(req, res){
  if(
    req.body.username == undefined
    ) {
    res.send(false);
  } else {
    auth.register(req.body.username, req.body.password).then(
      (result) => {
        if(result != false) {
          auth.login(req.body.username, req.body.password).then(
            function(result) {
              res.send({"result":result[0].rows_count>0});
            }
          );
        }
      }
    )
  }
});

module.exports = router;