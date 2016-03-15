var express = require('express');
var router = express.Router();
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

router.get('/login', function(req, res) {
  res.render('auth/login');
});

router.post('/login', function(req, res, next) {
  passport.authenticate('login', { session: true },function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (! user) {
      var jsonFailedLogin = {
        message : 'failed',
        authorize : 'false',
      }
      return res.send(jsonFailedLogin);
    }
    req.login(user, loginErr => {
      if (loginErr) {
        return next(loginErr);
      }
      var jsonSuccessLogin = {
        message : 'success',
        authorize : 'true',
      }
      return res.send(jsonSuccessLogin);
    });
  })(req, res, next);
});


router.get('/me', isAuthenticated, function(req, res){
  //res.render('home', { user: req.user });
  var jsonMe = {
      message: "success",
      currentUser: {
        objectId : req.user._id,
        username : req.user.username,
        email: req.user.email,
        fullname: req.user.fullname
      }
    }
  res.send(jsonMe);
});


router.get('/get-profile', function(req, res){
  var userId = req.query.objectId;
  console.log("----------->" + userId);
  AuthenticationController.profile(userId, function(err, list){
    var user = list[0];
    res.send(user);
  });
});

router.get('/edit/:userid', isAuthenticated, function(req, res){
  res.render('auth/edit', { user: req.user });
});

router.put('/edit/:userid', isAuthenticated, function(req, res){
  User.findByIdAndUpdate({_id: "56e116319791f889b0a3eee9"}, { $set: {email: "false@gmail.com"}} ,function (err, user) {
      callback(err, user);
  });
});


router.get('/profile/:userid', function(req, res){
		User.count({objectId: req.params.userid}, function (err, count){
			if(err){
				var jsonFailedUserProfile = {
					message: "Not Found"
				}
				res.send(jsonFailedUserProfile);
			}

	    if (count > 0) {
				User.findOne({ objectId : req.params.userid }, function(err, users){

					var jsonSuccessUserProfile = {
						message: "success",
						currentUser: {
							objectId : req.params.userid,
							username : users.username,
							email: users.email,
							fullname: users.fullname
						}
					}
					res.send(jsonSuccessUserProfile);
				});
	    }
		});
  });

router.get('/forgot-password', function(req, res){
  res.send("test send");
});

router.get('/signup', function(req, res){
		res.render('auth/signup');
});

router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/register',
		failureRedirect: '/signup-failed',
		failureFlash : true
}));

router.get('/signup-failed', function(req, res){
		var jsonFailedRegistration = {
			message: "failed",
			result: "failed",
			resultMessage: "Validation Message here"
			}
			res.send(jsonFailedRegistration);
});

router.get('/register', function(req, res){
		var jsonSuccessRegistration = {
			message: "success",
			result: "success",
			resultMessage: "Congratulations, You have successfully registered to ipostmo.com"
			}
			res.send(jsonSuccessRegistration);
});

router.get('/logout', isAuthenticated, function(req, res) {
  if (req.isAuthenticated()){
    req.session.destroy(function(err) {
      var jsonSuccessLogout = {
      result: "success",
      resultMessage: "Congratulations, You have successfully logged out."
        }
      res.send(jsonSuccessLogout);
    });
  }
  else{
    var jsonFailedLogout = {
        result: "failed",
        resultMessage: "Validation Message here"
      }
    res.send(jsonFailedLogout);

  }
});





//module.exports = router;
	return router;
}
