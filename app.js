var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
require('dotenv/config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var carRouter = require('./routes/cars');
var reviewRouter = require('./routes/review')

var app = express();
require("./config/session.config")(app);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  if(req.session.user){
    res.locals.isLoggedIn = true
  } else {
    res.locals.isLoggedIn = false
  }
  next()
})

//Setting storage engine
// const storageEngine = multer.diskStorage({
//   destination: "./images",
//   filename: (req, file, cb) => {
//   cb(null, `${Date.now()}--${file.originalname}`);
//   },
//   });

//this method checks if there is a current sessinon and user, if true, send it to locals which
//can be accessed by handlebars
app.use((req, res, next) => {
  if(req.session.user){
    console.log(req.session.user)
    res.locals.user = req.session.user;
  }
  next()
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/cars', carRouter);
app.use('/reviews', reviewRouter)

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
  res.render('error');
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(x => console.log(`Connected to Mongo! localhost:4000 Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));

module.exports = app;
