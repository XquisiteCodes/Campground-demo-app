var express = require('express');
var router   = express.Router();
var Comment  = require('../models/comments');
var Post     = require('../models/posts');
var middleware = require('../middleware');

router.get('/post/:id/comments/new',middleware.isLoggedIn, function(req, res){
    Post.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
        }else{
            res.render('comments/new', {campground : campground, currentUser: req.user});
        };
    });
});
router.post('/post/:id/comments',middleware.isLoggedIn, function(req, res){
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
router.get('/post/:id/comment/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment){
        if (err){
            res.redirect('back');
        } else {
            res.render('comments/edit', {campground_id : req.params.id, comment : comment});
        };
    });
});
router.put('/post/:id/comment/:comment_id',middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, update){
        if (err){
            res.redirect('back');
        } else {
            res.redirect('/post/' + req.params.id);
        };
    });
});
router.delete('/post/:id/comment/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err){
            res.redirect('back');
        } else {
            res.redirect('back');
        };
    });
});


module.exports = router;