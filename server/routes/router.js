const express = require('express');
const router = express.Router();
const user = require('../user/user');

var multer = require('multer');
// set the directory for the uploads to the uploaded to
var DIR = './public/files';
//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
var upload = multer({dest: DIR}).single('photo');

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
      // An error occurred when uploading
      console.log(err);
      return res.status(422).send("an Error occured")
    }  
   // No error occured.
    path = req.file.path;
    return res.send("Upload Completed for "+path);
  });
});

module.exports = router;