var express = require('express');
var router   = express.Router();
var User     = require('../models/user')
var passport = require('passport')

router.get('/register', function(req, res){
    res.render('register', {currentUser: req.user});
});
router.post('/register', function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            console.log(err);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function(){
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
    res.redirect('/post');
});
function isLoggedIn (req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};
module.exports = router;