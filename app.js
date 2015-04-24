var debug = require('debug')('app');
var wait = require('wait.for');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var rb = require('./rb');
var sumplight = require('./sumplight');
var tanklight = require('./tanklight');
var chaetolight = require('./chaetolight');
var x200 = require('./x200/build/Release/x200');
var alarm = require('./alarm');

var control = require('./control');

var io = { 
  sumplight: sumplight.open(),
  leftlight: tanklight.open('left'),
  rightlight: tanklight.open('right'),
  centerlight: tanklight.open('center'),
  fan: tanklight.daytime,
  chaetolight: chaetolight.open(),
  diverter: rb.open(0,4),
  sumpcirc: [ rb.open(1,6), rb.open(1,7) ],
  skimmer: rb.open(1,5),
  topoff: rb.open(1,2),
  alarm: alarm,
  x200: x200
};

debug("starting...");


x200.open();
var app = express();

app.set('io', io );

//  view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var tickid;

var gracefulShutdown = function() {
     x200.close();
    // alarm.set( alarm.config.close);
     clearTimeout(tickid);
     debug("exiting.")
     setTimeout( function() {
                     process.exit();
                     }, 1000);
    
}

process.on('SIGINT', gracefulShutdown );
process.on('SIGTERM', gracefulShutdown );


alarm.set( alarm.config.start, function() {
                                   debug("running.");
                                   tickid = setInterval( control.tick, 1000 );
});


module.exports = app;
