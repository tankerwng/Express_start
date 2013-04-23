var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
  user: { type: String, index: {unique: true }},
  post: String,
  time: Date
  }, {autoIndex: false});


var Posts = mongoose.model('Post', postSchema);

function Post(username, post, time){
  this.user = username;
  this.post = post;
  this.time = time;
  if(time){
    this.time = time;
  }else{
    this.time = new Date();
  }
}

module.exports = Post;

Post.prototype.save = function save(callback){
  var post = new Posts({user: this.user, post: this.post, time: this.time});
  post.save(function(err, post){
  if(err){
   console.log(err);
   return callback(error);
  }else{
   console.log(post);
   callback(err, post);  
  }
  });
};


Post.get = function get(username, callback){
  var query = {};
  if(username){
   query.user = username;
  }
  Posts.find(query, function(err, data) {
   if(err){
   console.log(err);
   return callback(err, null);
  }
    var posts = [];
    data.forEach(function(d, index){
      var post = new Post(d.user, d.post, d.time);
      posts.push(post);
    });
    callback(null, posts);  
  });
};