
/*
 * GET users listing.
 */

var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/Post.js');

exports.list = function(req, res){
  res.render('list', { title :'List', users: ['tankerwng', 'wangxiaodong', 'tanker.wang']});
};

exports.home = function(req, res){
  User.get(req.params.user, function(err, user){
   if(!user){
     req.flash('error', '用户不存在');
     return res.redirect('/');
   }

   Post.get(user.name, function(err, posts){
    if(err){
      req.flash('error', err);
      return res.redirect('/');
    }
    res.render('user',{ title: user.name, posts: posts});
   })
  });
};

exports.post = function(req, res){
  var currentUser = req.session.user;
  var post = new Post(currentUser.name, req.body.post);
  post.save(function(err) {
    if (err) {
    req.flash('error', err);
    return res.redirect('/');
    }
    req.flash('success', '发表成功');
    res.redirect('/u/'+ currentUser.name);
    });
};

exports.reg = function(req, res){
  res.render('reg', { title :'用户注册' });
};

exports.doReg = function(req, res){
  if (req.body['password-repeat'] != req.body['password']) {
   req.flash('error', '两次输入的口令不一致');
   return res.redirect('/reg');
  };

  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');
  
  var new_user = new User(req.body.username, password);

  User.get(new_user.name, function(err, user){
    if (user)
    err = 'Username already exists.';
    if (err) {
    req.flash('error', err);
    return res.redirect('/reg');
    }
    //如果不存在则新增用户
    new_user.save(function(err) {
    if (err) {
    req.flash('error', err);
    return res.redirect('/reg');
    }
    req.session.user = new_user;
    req.flash('success', '注册成功');
    res.redirect('/');
    });
  });

};

exports.login = function(req, res){
  res.render('login', { title: '用户登入'});
};

exports.doLogin = function(req, res){
 var md5 = crypto.createHash('md5');
 var password = md5.update(req.body.password).digest("base64");
 User.get(req.body.username, function(err, user){
 if(!user){
   req.flash('error', '用户不存在');
   return res.redirect('/login');
 }
 if(user.password != password){
   req.flash('error', '用户口令错误');
   return res.redirect('/login');
 }

 req.session.user = user;
 req.flash('success', '登入成功');
 res.redirect('/');
 });
};

exports.logout = function(req, res){
 req.session.user = null;
 req.flash('success', '登出成功');
 res.redirect('/');
};