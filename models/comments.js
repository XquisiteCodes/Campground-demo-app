var mongoose = require('mongoose');
var commentScehema = new mongoose.Schema({
    author : String,
    comment : String,
    created : {type :Date, default: Date.now}
});

module.exports = mongoose.model('Comment', commentScehema);