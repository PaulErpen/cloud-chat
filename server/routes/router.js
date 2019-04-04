const express = require('express');
const router = express.Router();
const user = require('../user/user');
const fs = require('fs');
var path = require('path');
var messages = require("../messages/messages");
const mimeType = require("../filemanager/mimetype");

var multer = require('multer');

var DIR = '../public/files';
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, main_dir+"/public/files")
  }
})
var upload = multer({storage: storage}).single('photo');

/**
 * Checks if Parameters are undefined
 * Passes login request on to user login function and sends back result
 */
router.post('/login', function(req, res){
  if((req.body.username == undefined && 
  req.body.password == undefined)) {
      res.send(false);
  } else {
    new Promise(function(resolve, reject) {
      resolve(user.login(req.body.username, req.body.password));
    }).then(
      function(result) {
        res.send(result);
      }
    );
  } 
});

/**
 * Checks if Parameters are undefined
 * Passes register request on to user register function and sends back result
 */
router.post('/register', function(req, res){
  if((req.body.username == undefined && 
  req.body.password == undefined)) {
      res.send(false);
  } else {
    new Promise(function(resolve, reject) {
      resolve(user.register(req.body.username, req.body.password));
    }).then(
      function(result) {
        res.send(result);
      }
    );
  }
});

router.post('/upload', function(req, res){
  var path = '';
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      res.status(422).send("an Error occured")
    }

    res.send("Upload Completed for "+path);
    var selectedUsers = req.body.selectedUsers.split(";"); 
    if(req.body.selectedUsers != "") {
      messages.sendFileMessage(req.body.message, 
        req.body.username, 
        "http://localhost:3000/files/"+req.file.filename, 
        req.file.originalname,
        selectedUsers);
    } else {
      messages.sendFileBroadcast(req.body.message, 
        req.body.username, 
        "http://localhost:3000/files/"+req.file.filename, 
        req.file.originalname);
    }
  });
});

router.get('/file', function(req, res){
  if(req.query == undefined && req.query.name == undefined) {
      res.statusCode = 404;
      res.end(`No name given!`);
  }
  
  var pathname = main_dir + "/public/files/" + req.query.name;
  fs.exists(pathname, function (exist) {
    if(!exist) {
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    }

    if (fs.statSync(pathname).isDirectory()) {
      pathname += '/index.html';
    }

    fs.readFile(pathname, function(err, data){
      if(err){
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        const ext = path.parse(pathname).ext;
        res.setHeader('Content-type', mimeType[ext] || 'text/plain' );
        res.end(data);
      }
    });
  });
});

module.exports = router;