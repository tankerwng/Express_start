var settings = require('../settings');
var mongoose = require('mongoose');
var connect_str = 'mongodb://'+settings.host+'/'+settings.db;

module.exports = ModelBase;

function ModelBase(){
  this.mongoose = mongoose;
  this.mongodb = this.mongoose.connect(connect_str);
}
