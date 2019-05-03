const express = require('express');
const router = express.Router();
const userimage = new require('../database/userimage');
const auth = new require('../database/authentication');
const database = require("../database/database");

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
      req.body.password == undefined ||
      req.body.profilepic == undefined ||
      req.body.language == undefined
    ) {
    res.send(false);
  } else {
    auth.register(req.body.username, req.body.password, req.body.profilepic, req.body.language).then(
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

module.exports = router;