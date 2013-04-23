var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  name: { type: String, index: {unique: true }},
  password: String
  }, {autoIndex: false});

var Users = mongoose.model('User', userSchema);

function User(name, password){
  this.name = name;
  this.password = password;
}

module.exports = User;

User.prototype.save = function save(callback){
  var user = new Users({name: this.name, password: this.password});
  user.save(function(err, user){
  if(err){
   console.log(err);
   return callback(error);
  }else{
   console.log(user);
   callback(err, user);  
  }
  });
};


User.get = function get(username, callback){
  Users.findOne({ name: username }, function (err, data) {
   if(err){
   console.log(err);
   return callback(err);
  }
  if(data){
    var user = new Users(data);
    callback(err, user);  
  }
  else{
   callback(err, null);  
  }
  });
};