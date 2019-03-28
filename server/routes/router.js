const express = require('express');
const router = express.Router();

router.post('/login', function(req, res){
  if((req.body.username != undefined && 
  req.body.password != undefined)) {
      res.send(false);
  }
  new Promise(function(resolve, reject) {
    resolve(user.login(req.body.username, req.body.password));
  }).then(
    function(result) {
      res.send(result);
    }
  );
});

module.exports = router;