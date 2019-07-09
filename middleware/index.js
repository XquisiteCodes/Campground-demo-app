var Post = require('../models/posts');
var Comment = require('../models/comments');

var middleware = {};
middleware.isLoggedIn = function (req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You have to be logged in to do that');
    res.redirect('/login');
};

middleware.checkCampgroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()){
        Post.findById(req.params.id, function(err, campground){
            if (err){
                res.redirect('back')
            } else {
                if (campground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash('error', 'you do not have authorization to do that ');
                    res.redirect('back');
                };
            };
        });
    } else {
        res.redirect('back');
    };
};
middleware.checkCommentOwnership = function(req, res, next){
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, comment){
            if (err){
                res.redirect('back');
            } else {
                if (comment.author.id.equals(req.params.comment_id)){
                    next();
                } else{
                    req.flash('error', 'you do not have authorization to do that ')
                    res.redirect('back');
                };
            };
        });
    };
};
module.exports = middleware;
