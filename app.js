var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var routes = require('./routes/index');
var config = require('./config.js');
var User   = require('./dbschema/User.js');
var busboy = require('connect-busboy');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'userdata')));

mongoose.connection.on('connected', function () {
   	console.log("Mongoose connected to: " + config.DB_URL);
});
mongoose.connection.on('error', function(err) {
        console.log("Error connecting to mongodb: " + err);
});
mongoose.connect(config.DB_URL);

User.findOne({'auth.userId':'admin@securefileserver.com'}, function(err ,user){
	if(err) console.log('User Creation on start :  ' +err);
	if(!user){
		var newUser = new User();
		newUser.auth.userId = 'admin@securefileserver.com';
        newUser.role = 'admin';
		newUser.auth.password = newUser.generateHash('secure@123');
		newUser.save(function(err, user){
			if(user) { console.info('Admin Created');}
		});
	}
});


app.use('/', routes);


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


module.exports = app;
