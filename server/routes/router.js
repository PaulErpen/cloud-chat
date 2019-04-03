const express = require('express');
const router = express.Router();
const user = require('../user/user');
const fs = require('fs');
const filemanager = require('../filemanager/filemenager');
var path = require('path');

var multer = require('multer');

var DIR = '../public/files';
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, main_dir+"/public/files")
  }
})
var upload = multer({storage: storage}).single('photo');

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
      res.status(422).send("an Error occured")
    }
   // No error occured.
    path = req.file.path;
    res.send("Upload Completed for "+path);
    filemanager.addFile(req.file, req.body.user, re.body.selectedUsers);
    debugger;
  });
});

router.get('/file', function(req, res){
  const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'aplication/font-sfnt'
  };

  if(req.query == undefined && req.query.name == undefined) {
      res.statusCode = 404;
      res.end(`No name given!`);
  }
  
  var pathname = main_dir + "/public/files/" + req.query.name;
  fs.exists(pathname, function (exist) {
    if(!exist) {
      // if the file is not found, return 404
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