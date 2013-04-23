
/*
 * GET home page.
 */

var user = require('./user');
var Post = require('../models/Post.js');

module.exports = function(app){

app.get('/', function(req, res){
  Post.get(null, function(err, posts){
    if(err){
      posts = [];
    }
    res.render('index', { title: '首页' , posts: posts});
  });
});

app.get('/u/:user', user.home);

app.get('/logout', checkLogin);
app.post('/post', user.post);

app.get('/reg', checkNotLogin);
app.get('/reg', user.reg);

app.post('/reg', checkNotLogin);
app.post('/reg', user.doReg);

app.get('/login', checkNotLogin);
app.get('/login', user.login);

app.post('/login', checkNotLogin);
app.post('/login', user.doLogin);

app.get('/logout', checkLogin);
app.get('/logout', user.logout);

app.get('/users', user.list);

function checkLogin(req, res, next){
  if(!req.session.user){
    req.flash('error', '未登入');
    return res.redirect('/login');
  }
  next();
}

function checkNotLogin(req, res, next){
  if(req.session.user){
    req.flash('error', '已登入');
    return res.redirect('/');
  }
  next();
}

};
