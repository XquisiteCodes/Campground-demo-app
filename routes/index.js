var express = require('express');
var router   = express.Router();
var User     = require('../models/user');
var passport = require('passport');

router.get('/register', function(req, res){
    res.render('register', {currentUser: req.user});
});
router.post('/register', function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            req.flash('error', err.message)
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function(){
            req.flash('success', 'you have successfully signed up')
            res.redirect('/post');
        });
    });
});
router.get('/login', function(req, res){
    res.render('login', {currentUser: req.user});
});
router.post('/login',passport.authenticate('local',{
    successRedirect: '/post',
    failureRedirect: '/login'
}) ,function(req, res){

});
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'Successfully logged out')
    res.redirect('/post');
});
module.exports = router;