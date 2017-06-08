const url           = require("url");
const querystring   = require('querystring');

//Express and set up router
var express         = require('express');
var router          = express.Router();

//Configs and Modules
var config      = require("./../../config/config");
var mongoExport = require("./../../config/mongo");

var passport    = require("passport");
var users       = require("./../controllers/user.controller.server");



router.get("/", function(req, res){
    //req.query.location 
    var user = req.user;
    if(user){
        user.type = "user";
//        delete user.password;
        if(req.query.location){
            user.defaultLocation = req.query.location;
            mongoExport.users.set(user, function(res){
                console.log(res);
            });
        }
    }
    
    res.render("index", {"title": config.pageTitle, "user": user } );


    
});


router.route("/login")
    .get(
      function(req, res, next){
        if(!req.user){
            res.render('login', {
                title:      "Log In",
                messages:   req.flash('error') || req.flash('info')
            });
        }else{
            return res.redirect('/');
        }
    })
    .post(passport.authenticate('local', {
        successRedirect:    '/',
        failureRedirect:    '/login',
        failureFlash:       true
    } ));

router.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

router.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

 router.get('/signup',
  function(req, res){
    res.render('signup', {
        title:      "Sign Up",
        messages:   req.flash('error') || req.flash('info')
    } );
  }); 
  
router.post("/signup",
  function(req, res){
    users.signup(req, res);
  });

  
module.exports = router;