var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var userScehema = new mongoose.Schema({
    userName : String,
    password : String
});
userScehema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userScehema);