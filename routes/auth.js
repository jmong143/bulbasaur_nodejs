var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var tokenizer = require("../util/jwt-tokenizer");
var configureRouting = require('../services/RouteService');
var config = require('../config/application-settings');
var merge = require('merge'), original, cloned;
var ProceedUrl = "http://localhost:8000/";
var UserModel = require('../models/user');
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

	res.redirect('/ipostmo-auth/login');
}
var currentProfileGlobal = {}
var currentMeGlobal = {}
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


router.get('/signup', function(req, res){
		res.render('auth/signup');
});

router.post('/signup',function(req, res, next) {
  passport.authenticate('signup',{ session: true },function(err, signup, info) {
    if (err) {
      return next(err);
    }
    if (! signup) {
      var objRegister = {
        message: "failed",
        result: "failed",
        resultMessage: "Username is already Exists"
        }
    }else{
      var objRegister = {
          message: "success",
          result: "success",
          resultMessage: "Congratulations, You have successfully registered to ipostmo.com"
      }
    }
    return res.send(objRegister);
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
      var token = tokenizer.sign(user);
      var objLoginSuccess = {
        message : 'success',
        authorize : 'true',
        token : token
      }
      var sessionProfile = {
        message: "success",
        currentUser: {
        objectId : req.user.objectId,
        username : req.user.username,
        fullname: req.user.fullname,
        email: req.user.email,
        avatar:  req.user.avatar
        }
      }
      var userProfile = {
        message: "success",
        objectId : req.user.objectId,
        username : req.user.username,
        fullname: req.user.fullname,
        email: req.user.email,
        address: req.user.address,
        contact: req.user.contact,
        birthdate: req.user.birthdate,
        avatar: req.user.avatar,
        emailVerified: req.user.emailVerified
      }
      currentMeGlobal = sessionProfile;
      currentProfileGlobal = userProfile;
      return res.send(objLoginSuccess);
    });
  })(req, res, next);
});

//var tokenUser = tokenizer.verify;
//var currentObjectId = "2rOrhGKkY3";
router.get('/me', function(req, res){
  var objMe = currentMeGlobal;
  var isEmptySession = Object.keys(objMe).length;
  if(isEmptySession == 0){
    objMe = {message: "failed",result: "User is not yet logged in"}
    res.send(objMe);
  }else{
    res.send(currentProfileGlobal);
  }
});

router.get('/profile', function(req, res){
  var objProfile = currentMeGlobal;
  var isEmptySession = Object.keys(objProfile).length;
  if(isEmptySession == 0){
    objProfile = {message: "failed",result: "User is not yet logged in"}
    res.send(objProfile);
  }else{
    // var objProfileSuccess = {message: "success"}
    //var objProfile = merge(objProfile, objProfileSuccess);
    res.send(objProfile);
  }
});

router.get('/get-profile', function(req, res){
  var userId = req.query.objectId;
  AuthenticationController.profile(userId, function(err, list){
    var user = list[0];
    res.send(user);
  });
});

router.get('/update', isAuthenticated, function(req, res){
  res.render('auth/edit', { user: req.user });
});

router.post('/update', function(req, res){
  //var objectId = req.user.objectId;
  //var objectId = "ttjnXLHQt7";
  /*UserModel.update({'objectId':"ttjnXLHQt7"}, {$set: {email : "k@gmail.com"}},function(err, result){
    console.log(result);
  });*/

  var currentObjectId = req.body.currentObjectId;
  console.log("object id for update ------------->" + currentObjectId);
  var password = req.body.password;
  var hashPass = AuthenticationController.makeHashPassword(password);

  UserModel.update({'objectId': currentObjectId},
  {$set: {
      username : req.body.username,
      password :hashPass,
      address : req.body.address,
      birthdate : req.body.birthdate,
      contact : req.body.contact,
      email : req.body.email,
      fullname : req.body.fullname
    }
  },function(err, result){
    if (err) {
      obj = {
        message: "failed",
        resultMessage: "Failed to update, Please make sure you completed the form"
      }
    }else{
      obj = {
        message: "success",
        resultMessage: "Congratulations, Your Profile is Updated!"
      }
    }
    console.log("this is obj" + JSON.stringify(obj));
    return res.send(obj)
  });


/*  AuthenticationController.updateProfile(req, res, objectId, function(err, list){
    res.send(list);
  }); */
});


router.get('/profile/:userid', function(req, res){
  var userId = req.params.userid;
  AuthenticationController.profileById(userId, function(err, list){
    var userInfo = list[0];
    if (list == ""){
      obj = {
        message: "failed",
        resultMessage: "Failed to Retrieve User Information"
      };
    }else{
      obj = {
        message: "success",
        resultMessage: "Successfully Retrieve User Information",
        userInfo
      };
    }
    res.send(obj);
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

router.get('/mail-signup/:objectId', function(req, res){
  var updateObjectId = req.params.objectId;
  console.log("passed OBJECT ID " + updateObjectId);
    UserModel.update({'objectId': updateObjectId},
    {$set: {
        emailVerified : true
      }
    },function(err, result){
      UserModel.findOne({ "objectId": updateObjectId }, function (err, user) {
      console.log("THIS IS USER UPDATED ->" + JSON.stringify(user));
      var userUpdatedProfile = {
        message: "success",
        objectId : user.objectId,
        username : user.username,
        fullname: user.fullname,
        email: user.email,
        address: user.address,
        contact: user.contact,
        birthdate: user.birthdate,
        avatar: user.avatar,
        emailVerified: user.emailVerified
      }
      currentProfileGlobal = userUpdatedProfile;
       res.render("auth/email-signup");
    });
  });

});

router.get('/user/:objectId', function(req, res) {
  var params = req.params.objectId;
  UserModel.find( { $or:[ {'objectId':params}]},
    function(err,docs){
    if(!err) res.send(docs);
  });
});


router.get('/logout', function(req, res) {
/*  if (req.isAuthenticated()){
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
  } */

  var objLogout = currentMeGlobal;
  var isEmptySession = Object.keys(objLogout).length;
  if(isEmptySession == 0){
    objLogout = {message: "failed",resultMessage: "Failed to Logout! Make sure you're Logged in!"}
  }else{
    req.session.destroy();
    currentMeGlobal = {}
    objLogout = {message: "success",resultMessage: "Congratulations, You have successfully logged out."}
  }
  res.send(objLogout);





  /* var objLogout = currentMeGlobal;
  var isEmptySession = Object.keys(objMe).length;
  if(isEmptySession == 0){
    objLogout = {message: "failed",result: "user not yet logged in"}
    console.log("came from logout--->" + currentMeGlobal);
  }else{
    var objLogout = {
      result: "success",
      resultMessage: "Congratulations, You have successfully logged out."
    }
    res.send(objLogout);
  } */

});


//module.exports = router;
	return router;
}
