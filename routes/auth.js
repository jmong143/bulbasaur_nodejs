var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var tokenizer = require("../util/jwt-tokenizer");
var configureRouting = require('../services/RouteService');
var config = require('../config/application-settings');
var merge = require('merge'), original, cloned;
//var ProceedUrl = "http://localhost:8000/";
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
  passport.authenticate('login', function(err, user, info) {
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
        token : token,
        user
      }
      return res.send(objLoginSuccess);
    });
  })(req, res, next);
});

//var tokenUser = tokenizer.verify;
//var currentObjectId = "2rOrhGKkY3";
router.get('/me', function(req, res){
if(!req.user){
  var objMe = {message: "failed",result: "Please Login First"}
}else{
  console.log("THIS IS MEEE-> " + req.user);
  var objMe = {
    message: "success",
    currentUser:{
      objectId : req.user.objectId,
      username : req.user.username,
      fullname: req.user.fullname,
      email: req.user.email
    }
  }
}
  res.send(objMe);
});

router.get('/profile', function(req, res){
  if(req.user){
    objProfile = {
      message: "success",
      currentUser:{
        objectId : req.user.objectId,
        username : req.user.username,
        fullname: req.user.fullname,
        email: req.user.email,
        address: req.user.address,
        birthdate: req.user.birthdate,
        avatar: req.user.avatar
      }
    }
  }else{
    objProfile = {message: "failed",result: "Please Login First"}
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

router.get('/update-profile', isAuthenticated, function(req, res){
  res.render('auth/edit', { user: req.user });
});

router.post('/update-profile', function(req, res){
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
  AuthenticationController.sendResetPassword(email, req, res, function(err, list){
    if(list == ""){
      objForgot = {
        message: "failed",
        resultMessage: "Failed to retrieve your information",
      };
    }else{
      var user = list[0];
      objForgot = {
        message: "success",
        resultMessage: "Please check your email to change your password"
      };
    }
    res.send(objForgot);
  });

  // UserModel.findOne({ "email": email }, function (err, user) {
  //   console.log("THIS IS USER" + JSON.stringify(user));
  // });
  //AuthenticationController.sendResetPassword(email, req, res);
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
       res.render("auth/email-signup");
    });
  });

});

router.get('/update-password/:objectId', function(req, res){
  var objectId = req.params.objectId;
  console.log("passed OBJECT ID forgot" + objectId);
  res.render("auth/email-forgot", {objectId : objectId});
});

router.post('/update-password/:objectId', function(req, res){
  var objectId = req.params.objectId;
  var newPassword = req.body.password
  var hashPassword = AuthenticationController.makeHashPassword(newPassword);
  UserModel.update({'objectId': objectId},
  {$set: {
      password : hashPassword
    }
  },function(err, result){
    if(err){
      var objUpdatePassword = {
        message: "failed",
        resultMessage: "Failed to update, Please try again",
      }
    }else{
      if(req.user){
        req.session.destroy();
      }
      var objUpdatePassword = {
        message: "success",
        resultMessage: "Your password is successfully updated",
      }
    }
  res.send(objUpdatePassword);
  });
});


router.get('/user/:objectId', function(req, res) {
  var params = req.params.objectId;
  UserModel.find( { $or:[ {'objectId':params}]},
    function(err,userFetch){
      var user = userFetch[0];
      if(user){
        var objFetch = {
          message: "success",
          result: "successfully retrieve user",
          user
        }
      }
      else{
        var objFetch = {
          message: "failed",
          result: "failed to retrieve user"
        }
      }
    res.send(objFetch);
  });
});

router.get('/getPhoto/:objectId', function(req, res) {
  var objectId = req.params.objectId;
  AuthenticationController.profileById(objectId, function(err, list){
    var userInfo = list[0];
    if (list == ""){
      obj = {
        message: "failed",
        resultMessage: "this user doesn't have an avatar"
      };
    }else{
      obj = {
        message: "success",
        resultMessage: "Successfully Retrieve User Avatar",
        avatar: userInfo.avatar
      };
    }
    res.send(obj);
  });
});

router.get('/logout', function(req, res) {
  if(req.user){
    req.session.destroy();
    objLogout = {message: "success",resultMessage: "Congratulations, You have successfully logged out."}
  }else{
    objLogout = {message: "failed",resultMessage: "Failed to Logout! Make sure you're Logged in!"}
  }
  res.send(objLogout);
});

//module.exports = router;
	return router;
}
