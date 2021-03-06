const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');



//root
router.get("/", function(req, res) {
    res.render("landing")
});

//=============
//AUTH ROUTES
//=============

//register routes
router.get("/register", function(req, res) {
    res.render("register");
})

router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err){
            return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to YelpCamp "+ user.username);
            res.redirect("/campgrounds")
        })

    })
});

//login ROUTES
router.get("/login", function(req, res) {
    res.render("login");
})
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {})

//logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged out")
    res.redirect("/campgrounds");
})


module.exports = router;
