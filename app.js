const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const Campground = require("./models/campground");
const seedDB = require("./seeds");
const Comment = require('./models/comment');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const campgroundRoutes = require('./routes/campgrounds');
const authRoutes = require('./routes/index');
const commentRoutes = require('./routes/comments');

//mongoose.connect("mongodb://localhost/yelp_camp_final");
mongoose.connect("mongodb://oscar:oscar@ds121309.mlab.com:21309/yelpcamposcarfredriksson");
//mongodb://<Tinnitus>:<T1nnitus>@ds121309.mlab.com:21309/yelpcamposcarfredriksson
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seed the database
//seedDB();

//Passport config
app.use(require("express-session")({secret: "However difficult life may seem, there is always something you can do and succeed at", resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

passport.use(new LocalStrategy(User.authenticate())),
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, function() {
    console.log("Listening on port 3000");
});
