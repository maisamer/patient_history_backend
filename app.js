var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var patentRouter = require('./routes/patient');
var adminRouter = require('./routes/conAdmin');
var clinicRouter = require('./routes/clinic');
var appointmentRouter = require('./routes/appointment');
var hospitalRouter = require('./routes/hostpital');
var labRouter = require('./routes/lab');
var adRouter = require('./routes/ad');
var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/doctors', indexRouter);
app.use('/patient',patentRouter);
app.use('/admin',adminRouter);
app.use('/clinic',clinicRouter);
app.use('/hospital',hospitalRouter);
app.use('/ad',adRouter);
app.use('/lab',labRouter);
app.use('/appointment',appointmentRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({statud : 404,message:'404 : Error'});
});

module.exports = app;
