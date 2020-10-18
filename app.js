var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose=require('mongoose');
var session= require('express-session');
var passport= require('passport');
var flash= require('connect-flash');
var MongoStore= require('connect-mongo')(session);

var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var employee = require('./routes/employee');
var manager = require('./routes/manager');
expressValidator = require('express-validator');

// mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/HRMS', {userNewUrlParser: true});
const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open',()=>{
  console.log("connecterd");
});
require('./config/passport.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//validator should be ater body parser
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'mysupersecret', resave: false, saveUninitialized: false, store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  cookie:{maxAge: 180*60*1000},
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/users', users);
app.use('/admin', admin);
app.use('/manager', manager);
app.use('/employee', employee);
const user=require("./models/user");
const bcrypt =require("bcryptjs")
// app.get('/test',function(req,res){
//   // user.deleteOne({email:"admin@admin.com"},function(err,result){
//   //   if(err)throw err
//   //   res.send(result);
//   // })
//   let data={

//     type: 'admin',
//     email: 'admin@admin.com',
//     password: bcrypt.hashSync('admin123', bcrypt.genSaltSync(5), null),
//     name: 'Sajjad Ali',
//     dateOfBirth: new Date('1990-05-26'),
//     contactNumber: '0300-4297859',
// };
//   let user1= new user(data);
//   // res.send(user)
//   user1.save(data, function(err,result){
//     if(err)throw err;
//     console.log(result);
//   });
// });
app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  res.locals.messages=req.flash();
  next();
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
const port = 5000;

app.listen(port, () =>{console.log(`the server started on port ${port}`)})
module.exports = app;
