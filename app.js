var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');

var ejs = require('ejs');

var routes = require('./routes/index');
var user = require('./routes/user');
// var mongoroutes = require('./routes/mongo');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(cookieParser());
app.use(cookieSession({
  secret: 'my super secret String'
}));


app.use('/', routes);
app.use('/', user);
// app.use('/', mongoroutes);


// catch 404 and forward to error handler
app.use(function(req, res) {
  res.status(400);
  res.render('./error/404.html');
});
// error 505 handlers
app.use(function(error, req, res, next) {
  res.status(500);
  res.render('./error/500.html',{
    message : res.__('error.404_1')
  });
});


module.exports = app;
