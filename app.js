var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var session = require('client-sessions');
var mongo = require('mongodb');
var monk = require('monk');
var dbApp = monk('localhost:27017/appointments');
var dbUser = monk('localhost:27017/appointments');

var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  cookieName: 'session',
  secret: '20F99CD92BF5812C37588975E695C2445233161EBE3BF147DCAC59811D0B24DBBFB683FAA210D82188276BE1464812223EF80D63A7E1C9F69A3C7FD7F782566C',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

app.use(function(req,res,next){
    req.dbApp = dbApp;
  	req.dbUser = dbUser;
    next();
});

app.use('/', index);
app.use(helmet());

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
