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
    auth.login(req.body.username).then(
      function(result) {
        var hashedPassword = database.cleanString(result[0].rows[0][0]);
        bcrypt.compare(req.body.password, hashedPassword).then((result) => {
            res.send({"result": result});
        });
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
    bcrypt.hash(req.body.password, saltRounds, function(error, hash) {
      if(error) {
        res.send({"result":false});
      } else {
        auth.register(req.body.username, hash, req.body.profilepic, req.body.language).then(
          (result) => {
            if(result) {
              auth.login(req.body.username).then(
                function(result) {
                  var hashedPassword = database.cleanString(result[0].rows[0][0]);
                  bcrypt.compare(req.body.password, hashedPassword).then((result) => {
                      res.send({"result": result});
                  });
                }
              );
            } else {
              res.send({"result":false});
            }
          }
        )
      }
    });
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