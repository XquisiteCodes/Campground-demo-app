var express          = require('express'),
    mongoose         = require('mongoose'),
    bodyParser       = require('body-parser'),
    methodOverride   = require('method-override'),
    expressSanitizer = require('express-sanitizer'),
    User             = require('./models/user'),
    seedDB           = require('./seeds'),
    localStrategy    = require('passport-local'),
    passport         = require('passport'),
    expressSession   = require('express-session'),
    postRoutes       = require('./routes/post'),
    commentRoutes    = require('./routes/comment'),
    indexRoutes      = require('./routes/index'),
    app              = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.use(expressSanitizer());
app.set('view engine' , 'ejs');
app.use(express.static('views/public'));
// seedDB();

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
app.use(postRoutes);
app.use(commentRoutes);
app.use(indexRoutes);

app.listen(3000, function(){
    console.log('Server started');
});