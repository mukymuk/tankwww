var express = require('express');
var router = express.Router();


/* GET home page. */ 

router.get('/', function(req, res, next) {
  var sl = req.app.get('sumplight');
  res.render('index', { title: 'Express', sumplight: sl.get()==true ? "On" : "Off" });
});

module.exports = router;
