var settings = require('../settings');
var mongoose = require('mongoose');
var connect_str = 'mongodb://'+settings.host+'/'+settings.db;
module.exports = mongoose.connect(connect_str);