var express          = require('express'),
    mongoose         = require('mongoose'),
    bodyParser       = require('body-parser'),
    methodOverride   = require('method-override'),
    expressSanitizer = require('express-sanitizer'),
    Post             = require('./models/posts'),
    User             = require('./models/user'),
    Comment          = require('./models/comments'),
    seedDB           = require('./seeds'),
    localStrategy    = require('passport-local'),
    passport         = require('passport'),
    expressSession   = require('express-session')
    app              = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.use(expressSanitizer());
app.set('view engine' , 'ejs');
app.use(express.static('views/public'));
seedDB();

mongoose.connect('mongodb://localhost/CampSites', {useNewUrlParser: true, useFindAndModify: false});

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});
//Passport Configuration
app.use(expressSession({
    secret: 'anything',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Post routes
app.get('/', function(req, res){
    res.redirect('/post');
});
app.get('/post', function(req, res){
    Post.find({}, function(err, posts){
        if (err){
            console.log(err);
        } else {
            return res.render('campgrounds/index', {posts : posts, currentUser: req.user});
        }
    }) 
});

app.get('/post/new', function(req, res){
    res.render('campgrounds/new');
})
app.post('/post', function(req, res){
    req.body.post.description = req.sanitize(req.body.post.description);
    Post.create(req.body.post, function(err, newPost){
        if (err) {
            console.log(err);
        } else {
            res.redirect('/post');
        }
    });
});

app.get('/post/:id', function(req, res){
    Post.findById(req.params.id).populate('comments').exec(function(err, post){
        if (err){
            res.redirect('/post');
        } else{
            res.render('campgrounds/show', {post: post});
        };
    });
});
app.get('/post/:id/edit', function(req, res){
    Post.findById(req.params.id, function(err, post){
        if (err){
            res.redirect('/post')
        } else {
            res.render('edit', {post: post})
        };
    });
});
app.put('/post/:id', function(req, res){
    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, post){
        if (err){
            res.redirect('/post');
        } else {
            res.redirect('/post/' + req.params.id);
        };
    });
});
app.delete('/post/:id', function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.redirect('/post');
        } else {
            res.redirect('/post');
        };
    });
});

//Comments Route
app.get('/post/:id/comments/new',isLoggedIn, function(req, res){
    Post.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
        }else{
            res.render('comments/new', {campground : campground});
        };
    });
});
app.post('/post/:id/comments',isLoggedIn, function(req, res){
    Post.findById(req.params.id, function(err, post){
        if(err){
            console.log(err);
        } else{
            Comment.create(req.body.comment, function(err, newComment){
                if (err){
                    console.log(err);
                    res.redirect('/post/:id/comments/new');
                } else {
                    post.comments.push(newComment);
                    post.save();
                    res.redirect('/post/' + post._id);
                };
            });
        };
        
    });
    
});
//Authntication routes
app.get('/register', function(req, res){
    res.render('register');
});
app.post('/register', function(req, res){
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
app.get('/login', function(req, res){
    res.render('login');
});
app.post('/login',passport.authenticate('local',{
    successRedirect: '/post',
    failureRedirect: '/login'
}) ,function(req, res){

});
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/post');
});
function isLoggedIn (req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};

app.listen(3000, function(){
    console.log('Server started');
});