var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var admin = require("firebase-admin");
const serviceAccountPath = "C://Users//go//Downloads//patient-history-c41dda1dd688.json";
var serviceAccount = require(serviceAccountPath);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "patient-history-12cb8.appspot.com"
});
var doctorRouter = require('./routes/doctor');
var patentRouter = require('./routes/patient');
var adminRouter = require('./routes/conAdmin');
var clinicRouter = require('./routes/clinic');
var appointmentRouter = require('./routes/appointment');
var hospitalRouter = require('./routes/hostpital');
var labRouter = require('./routes/lab');
var pharmacyRouter = require('./routes/pharmacy');
var sessionRouter = require('./routes/session');
var PhysicalExamRouter = require('./routes/Physical_Exam');
var socialHabitRouter = require('./routes/Social Habit');
var allergiesRouter = require('./routes/allergies');
var remediesRouter = require('./routes/Remedies');
var postRouter = require('./routes/post');
var diseaseRouter = require('./routes/disease');
var  familyDiseaseRouter = require('./routes/family_Diseases');
var adsRouter = require('./routes/ads');
var medicineRouter = require('./routes/medicine');
var fileRouter = require('./routes/file');
var DietaryInformation = require('./routes/dietary Information');
var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//CORS validation
app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET, POST , DELETE ,PATCH');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  next();
});

app.use('/doctor', doctorRouter);
app.use('/patient',patentRouter);
app.use('/admin',adminRouter);
app.use('/clinic',clinicRouter);
app.use('/hospital',hospitalRouter);
app.use('/pharmacy',pharmacyRouter);
app.use('/session',sessionRouter);
app.use('/lab',labRouter);
app.use('/appointment',appointmentRouter);
app.use('/physicalexam',PhysicalExamRouter);
app.use('/socialHabit',socialHabitRouter);
app.use('/allergies',allergiesRouter);
app.use('/remedies',remediesRouter);
app.use('/post',postRouter);
app.use('/disease',diseaseRouter);
app.use('/dietaryInformation',DietaryInformation);
app.use('/familyDisease',familyDiseaseRouter);
app.use('/ads',adsRouter);
app.use('/medicine',medicineRouter);
app.use('/file',fileRouter);

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
