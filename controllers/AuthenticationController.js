//Sample Implementation
var User = require('../models/user');
var tokenizer = require("../util/jwt-tokenizer");
var bCrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');

  var BaseController = require('../controllers/BaseCRUDController')("user");
//    var Controller = require('../controllers/BaseCRUDController')(model);
  var MyOwnController = {
      login : function(callback){
        callback("IM IN LOGIN");
      },

      profile : function(req, userId, callback){
          var userId = req.user.userId;
          var searchCriteria = {"objectId" : userId};
          this.search(searchCriteria, function(err, list){
              callback(err, list)
          });
      },

      profileById : function( userId, callback){
          var searchCriteria = {"objectId" : userId};
          this.search(searchCriteria, function(err, list){
              callback(err, list)
          });
      },

      forgotPassword : function( email, callback){
          var searchCriteria = {"email" : email};
          this.search(searchCriteria, function(err, list){
              callback(err, list)
          });
      },

      updateProfile : function(req, res, objectId, callback){
          User.findOne({ "objectId": objectId }, function (err, user) {
            if (err) return res.send(err);
              var password = req.body.password;
              user.username = req.body.username;
              user.password = createHash(password);
              user.address = req.body.address;
              user.birthdate = req.body.birthdate;
              user.contact = req.body.contact;
              user.email = req.body.email;
              user.fullname = req.body.fullname;
              user.save (function (err, result) {
                if (err) {
                  obj = {
                    result: "failed",
                    resultMessage: "Failed to update"
                  }
                }else{
                  obj = {
                    result: "success",
                    resultMessage: "Congratulations, Profile Updated"
                  }
                }
                console.log(obj);
                //return result(obj);
                return res.send(obj);
              });
            });
            var createHash = function(password){
                return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
            }
      },

      fetchData: function(parameter, req, res, callback){
        UserModel.find( { $or:[ {'objectId':parameter}]},
          function(err, users){
            if(!err)
            return res.send(users);
        });
      },

      getDateTime: function(){
        var date = new Date();

        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;

        var min = date.getMinutes();
        min = (min < 10 ? "0"  : "") + min;

        var sec = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;

        var year = date.getFullYear();

        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;

        var day = date.getDate();
        day = (day < 10 ? "0" : "") + day;
        return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
      },

      makeObjectId : function(){
        var objectId = "";
        var ramdomObject = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i=0; i<10; i++)
          objectId += ramdomObject.charAt(Math.floor(Math.random()*ramdomObject.length));

          return objectId;
      },

      makeHashPassword : function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
      },

      sendMailVerify : function(email, objectId){
        var transporter = nodemailer.createTransport({
        		service: 'Gmail',
        		auth: {
        				user: 'seostardibs@gmail.com',
        				pass: 'dibs0102'
        		}
        });
        console.log("new object ID-> " + objectId);
        // var emailTemplate = '<div style="text-decoration: underline;"><a href = "http://localhost:2000/ipostmo-auth/mail-signup/'+ objectId +'">click to verify your account101</a></div>';
        var emailTemplate = '<div style="text-decoration: underline;"><a href = "http://54.169.83.117:2000/ipostmo-auth/mail-signup/'+ objectId +'">click to verify your account101</a></div>';
        var mailOptions = {
          from: '"Ipostmo.com" <ipostmo@gmail.com>', // sender address
          to: 'email,' + email, // list of receivers
          subject: 'Welcome to Ipostmo.com!', // Subject line
          text: 'Ipostmo.com Verification', // plaintext body
          html: emailTemplate // html body
        };
        transporter.sendMail(mailOptions, function(error, info){
        if(error){
          return console.log(error);
        }
          console.log('Message sent: ' + info.response);
        });
      },

      sendResetPassword : function(email, req, res, callback){
        var searchCriteria = {"email" : email};
        this.search(searchCriteria, function(err, list){
          var user = list[0];
          var objectId = user.objectId;
          if(list == ""){
            console.log("email not existing");
          }else{
            console.log("TO OBJECT ID -> " + list.objectId);
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'seostardibs@gmail.com',
                    pass: 'dibs0102'
                }
            });
            var emailTemplate = '<div style="text-decoration: underline;"><a href = "http://54.169.83.117:2000/ipostmo-auth/update-password/'+ objectId +'">click to reset your password 1</a></div>';
            var mailOptions = {
              from: '"Ipostmo.com" <ipostmo@gmail.com>', // sender address
              to: 'email,' + email, // list of receivers
              subject: 'Welcome to Ipostmo.com!', // Subject line
              text: 'Ipostmo.com Verification', // plaintext body
              html: emailTemplate // html body
            };
            transporter.sendMail(mailOptions, function(error, info){
              console.log('Message sent for forgot password: ' + info.response);
            });
          }
          callback(err, list)
        });
      }
  };

  //var CustomController = Object.create(MyOwnController); //create copy
  MyOwnController.__proto__ = BaseController;
      //MyOwnController.find("Sample Custom controller");
  module.exports = MyOwnController;
