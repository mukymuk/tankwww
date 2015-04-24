var express = require('express');
var router = express.Router();


/* GET home page. */ 

router.get('/', function(req, res, next) {
  var io = req.app.get('io');

  res.render('index', { title: 'Tank', 
      sumplight: io.sumplight.get()==true ? "On" : "Off", 
      leftlight: io.leftlight.get(), 
      centerlight: io.centerlight.get(), 
      rightlight: io.rightlight.get(),
      fan: io.fan()==true ? "On" : "Off",
      chaetolight: io.chaetolight.get()==true ? "On" : "Off",
      x200: io.x200.frequency(),
      diverter: io.diverter.get()==true ? "Right" : "Left"
  });
});

module.exports = router;
