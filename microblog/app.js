
/**
 * Module dependencies.
 */

var fs = require('fs');
var accessLogfile = fs.createWriteStream('./log/access.log', {flags: 'a'});
var errorLogfile = fs.createWriteStream('./log/error.log', {flags: 'a'});

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , partials = require('express-partials')
  , MongoStore = require('connect-mongo')(express)
  , settings = require('./settings')
  , flash = require('connect-flash')
  , mongoose = require('mongoose')
  , settings = require('./settings')
  , expressError = require('express-error');

var connect_str = 'mongodb://'+settings.host+'/'+settings.db;
mongoose.connect(connect_str);

var app = express();

// all environments
app.use(express.logger({stream: accessLogfile}));

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session({
        secret: settings.cookie_secret,
        store: new MongoStore({
          db: settings.db
        })
      }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
//app.dynamicHelpers
app.use(function(req, res, next){
  res.locals.user = req.session.user;
  var error = req.flash('error');
  res.locals.error = error.length? error : null;
  var success = req.flash('success');
  res.locals.success = success.length? success : null;
  next();
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.use(expressError.express3({contextLinesCount: 3, handleUncaughtException: true}));
}


app.use(app.router);
//app.use(express.router(routes));
routes(app);

app.use(function (err, req, res, next) {
  var meta = '[' + new Date() + '] ' + req.url + '\n';
  errorLogfile.write(meta + err.stack + '\n');
  next();
});

/*
app.get('/', routes.index);
app.get('/u/:user', user.home);
app.post('/post', user.post);
app.get('/reg', user.reg);
app.post('/reg', user.doReg);
app.get('/login', user.login);
app.post('/login', user.doLogin);
app.get('/logout', user.logout);
app.get('/users', user.list);
*/

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
