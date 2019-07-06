var express = require('express');
var router   = express.Router();
var Comment  = require('../models/comments');
var Post     = require('../models/posts');


router.get('/post/:id/comments/new',isLoggedIn, function(req, res){
    Post.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
        }else{
            res.render('comments/new', {campground : campground, currentUser: req.user});
        };
    });
});
router.post('/post/:id/comments',isLoggedIn, function(req, res){
    Post.findById(req.params.id, function(err, post){
        if(err){
            console.log(err);
        } else{
            Comment.create(req.body.comment, function(err, newComment){
                if (err){
                    console.log(err);
                    res.redirect('/post/:id/comments/new');
                } else {
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    post.comments.push(newComment);
                    post.save();
                    res.redirect('/post/' + post._id);
                };
            });
        };
        
    });
    
});
function isLoggedIn (req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};

module.exports = router;