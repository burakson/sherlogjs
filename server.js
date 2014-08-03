/**
 * Sherlog.js
 * Javascript error and event tracker application.
 *
 * Copyright (c) 2014 Burak Son
 * http://github.com/burakson/sherlogjs/LICENSE.md
 */

var config       = require('./config/config.json')
  , fs           = require('fs')
  , http         = require('http')
  , express      = require('express')
  , session      = require('express-session')
  , passport     = require('passport')
  , cookieParser = require('cookie-parser')
  , Strategy     = require('passport-local').Strategy
  , mongoose     = require('mongoose')
  , mongoStore   = require('connect-mongo')(session)
  , bodyParser   = require('body-parser')
  , colors       = require('colors')
  , routes       = require('./app/routes/routes')
  , app          = express();


var db = mongoose.connect(
  'mongodb://'+ config.database.host + '/' + config.database.db_name, {
    user: config.database.user,
    pass: config.database.pw })
  .connection.on('error', function() {
    console.log('Could not connect to the database!'.red);
  });

// ensure that bower packages are installed
fs.exists('bower_components', function (exists) { 
  if (!exists) { 
    console.log('Bower packages are missing. Please run `bower install`'.red);
    process.exit(1);
  } 
}); 

// ensure that the required gulp task is completed
fs.exists('public/js/sherlog.min.js', function (exists) { 
  if (!exists) { 
    console.log('Assets are missing. Please run `gulp`'.red);
    process.exit(1);
  } 
});

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use( new Strategy(function (username, password, done) {
  var hasAccess = username == config.credentials.username &&
                  password == config.credentials.password;

  done(null, hasAccess);
}));

var isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};  

// express setup
app.use(bodyParser());
app.use(cookieParser());
app.use(session({
  secret: __dirname.replace(/[\/]/g, ''),
  maxAge: new Date(Date.now() + 3600000),
  store: new mongoStore({mongoose_connection: db}),
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.set('view engine', 'jade');
app.set('views', __dirname + '/app/views');
app.set('showStackError', true);

app.use(function (req, res, next){
  res.locals.site_title = config.site_title;
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

// routes
app.get('/',                          isAuthenticated, routes.index);
app.get('/login',                     routes.login);
app.get('/logout',                    routes.logout);
app.get('/dashboard',                 isAuthenticated, routes.dashboard);
app.get('/dashboard/:type',           isAuthenticated, routes.dashboard);
app.get('/dashboard/details/:id',     isAuthenticated, routes.details);
app.get('/'+ config.pixel_name,       routes.tracker);
app.post('/login',                    passport.authenticate('local', { successRedirect : '/', failureRedirect : '/login' }));
app.all('*',                          routes.notfound);

app.listen( config.node_server.port, config.node_server.host, '', function() {
  console.log(('Sherlog is listening tracking requests at: '+ config.node_server.port).yellow);
});
