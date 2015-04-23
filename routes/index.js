var express = require('express');
var router = express.Router();


/* GET home page. */ 

router.get('/', function(req, res, next) {
  var sl = req.app.get('sumplight');
  var leftlight = req.app.get('leftlight');
  var centerlight = req.app.get('centerlight');
  var rightlight = req.app.get('rightlight');
  var chaetolight = req.app.get('chaetolight');
  var fanstate = req.app.get('fan');
  var x200 = req.app.get('x200');

  res.render('index', { title: 'Tank', 
      sumplight: sl.get()==true ? "On" : "Off", 
      leftlight: leftlight.get(), 
      centerlight: centerlight.get(), 
      rightlight: rightlight.get(),
      fan: fanstate()==true ? "On" : "Off",
      chaetolight: chaetolight.get()==true ? "On" : "Off",
      x200: x200.hello()
  });
});

module.exports = router;
