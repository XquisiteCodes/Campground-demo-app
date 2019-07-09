var express = require('express');
var router   = express.Router();
var Post     = require('../models/posts');
var middleware = require('../middleware');

router.get('/', function(req, res){
    res.redirect('/post');
});
router.get('/post', function(req, res){
    Post.find({}, function(err, posts){
        if (err){
            console.log(err);
        } else {
            return res.render('campgrounds/index', {posts : posts, currentUser: req.user});
        }
    }) 
});

router.get('/post/new',middleware.isLoggedIn, function(req, res){
    res.render('campgrounds/new', {currentUser: req.user});
});
router.post('/post',middleware.isLoggedIn, function(req, res){
    req.body.post.description = req.sanitize(req.body.post.description);
    var author = {
        id : req.user._id,
        username : req.user.username
    };
    Post.create(Object.assign(req.body.post, {author : author}), function(err, newPost){
        if (err) {
            console.log(err);
        } else {
            res.redirect('/post');
        }
    });
});

router.get('/post/:id', function(req, res){
    Post.findById(req.params.id).populate('comments').exec(function(err, post){
        if (err){
            res.redirect('/post');
        } else{
            res.render('campgrounds/show', {post: post, currentUser: req.user});
        };
    });
});
router.get('/post/:id/edit',middleware.checkCampgroundOwnership, function(req, res){
    Post.findById(req.params.id, function(err, post){
        if (err){
            res.redirect('/post');
        } else {
            res.render('campgrounds/edit', {post: post, currentUser: req.user});
        };
    });
});
router.put('/post/:id',middleware.checkCampgroundOwnership, function(req, res){
    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, post){
        if (err){
            res.redirect('/post');
        } else {
            res.redirect('/post/' + req.params.id);
        };
    });
});
router.delete('/post/:id',middleware.checkCampgroundOwnership, function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.redirect('/post');
        } else {
            res.redirect('/post');
        };
    });
});

module.exports = router;