var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var tokenizer = require("../util/jwt-tokenizer");
var configureRouting = require('../services/RouteService');
var User = require('../models/user');
//settings = {modelName: route-alias};
var settings = [
  //{ modelName: "banner", route: "banner" },
  { modelName: "post", route: "post" , list: {"username":1}},
  { modelName: "user", route: "user-101" , list: {"username":1}}
];

for(var i=0; i<settings.length;i++){
  var setting = settings[i];
  var model = setting.modelName;
  var route = setting.route;
  var listFields = setting.list;
  var controller = require('../controllers/BaseCRUDController')(model);
      router = configureRouting(router, route, controller, listFields);
}

var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/login');
}

module.exports = function(passport){
//CustomController codes here

var AuthenticationController = require('../controllers/AuthenticationController');
router.get('/custom-auth-1' , function(req, res, next) {
  /*
    WhateverController.view("56d00792e0816af8064c3a0c", function(err, results){
        res.send("WHATEVER CONTROLLER : " + JSON.stringify(results) + "===" + WhateverController.method2());
    });
  */
  AuthenticationController.login(function(string){
    res.send("LOGIN..." + string);
  });
});


router.get('/register', function(req, res){
		res.render('auth/signup');
});

router.post('/register',function(req, res, next) {
  passport.authenticate('signup',{ session: true },function(err, signup, info) {
    if (err) {
      return next(err);
    }
    if (! signup) {
      var objRegister = {
        message: "failed",
        result: "failed",
        resultMessage: "Validation Message here"
        }
    }else{
      var objRegister = {
          message: "success",
          result: "success",
          resultMessage: "Congratulations, You have successfully registered to ipostmo.com"
      }
      return res.send(objRegister);
    }
  })(req, res, next);
 });

 router.get('/token', function(req, res) {
   var user = {username: "akousername", fullname: "akofullname"};
   var token = tokenizer.sign(user);
   res.send(token);
 });

 router.get('/decode', tokenizer.verify, function(req, res, next) {
   res.send(JSON.stringify(req.decoded));
 });

router.get('/login', function(req, res) {
  res.render('auth/login');
});

router.post('/login', function(req, res, next) {
  passport.authenticate('login', { session: true },function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (! user) {
      var objLoginFailed = {
        message : 'failed',
        authorize : 'false'
      }
      return res.send(objLoginFailed);
    }
    req.login(user, loginErr => {
      if (loginErr) {
        return next(loginErr);
      }
      var objLoginSuccess = {
        message : 'success',
        authorize : 'true',
        currentUser: {
          objectId : req.user._id,
          username : req.user.username,
          email: req.user.email,
          fullname: req.user.fullname
        }
      }



      return res.send(objLoginSuccess);
    });
  })(req, res, next);
});


router.get('/me', function(req, res){
  var objMe = {
      token : req.user.token,
      message: "success",
      currentUser: {
        objectId : req.user._id,
        username : req.user.username,
        email: req.user.email,
        fullname: req.user.fullname
      }
    }
  res.send(objMe);
});


router.get('/profile', isAuthenticated, function(req, res){
  var objProfile = {
      message: "success",
      currentUser: {
        objectId : req.user._id,
        username : req.user.username,
        email: req.user.email,
        fullname: req.user.fullname
      }
    }
  res.send(objProfile);
});


router.get('/get-profile', function(req, res){
  var userId = req.query.objectId;
  AuthenticationController.profile(userId, function(err, list){
    var user = list[0];
    res.send(user);
  });
});

router.get('/edit', isAuthenticated, function(req, res){
  res.render('auth/edit', { user: req.user });
});

router.post('/update', isAuthenticated, function(req, res){
  var objectId = req.user.objectId;
  AuthenticationController.updateProfile(req, res, objectId, function(err, list){
    res.send(user);
  });
});


router.get('/profile/:userid', function(req, res){
  var userId = req.params.userid;
  AuthenticationController.profileById(userId, function(err, list){
    var user = list[0];
    res.send(user);
  });
});

router.get('/forgot-password', function(req, res){
  res.render("auth/forgot");
});

router.post('/forgot-password', function(req, res){
  var email = req.body.email;
  AuthenticationController.forgotPassword(email, function(err, list){
    var user = list[0];
    res.send(user);
  });
});

router.get('/logout', function(req, res) {
  if (req.isAuthenticated()){
    req.session.destroy(function(err) {
      var objLogout = {
        result: "success",
        resultMessage: "Congratulations, You have successfully logged out."
      }
      res.send(objLogout);
    });
  }else{
    var objLogout = {
        result: "failed",
        resultMessage: "User not login"
      }
      res.send(objLogout);
  }
});





//module.exports = router;
	return router;
}
