//Sample Implementation
//  var User = require('../models/user');
  var BaseController = require('../controllers/BaseCRUDController')("user");
//    var Controller = require('../controllers/BaseCRUDController')(model);
  var MyOwnController = {
      login : function(callback){
        callback("IM IN LOGIN");
      },

      profile : function( userId, callback){
          /*
          this.model.findOne({ objectId : userId }, function(err, users){
            var jsonSessionProfile = {
              message: "success",
              currentUser: {
                objectId : users.objectId,
                username : users.username,
                email: users.email,
                fullname: users.fullname
              }
            }
            callback(jsonSessionProfile);
            //res.send(jsonSessionProfile);
          });
          */
          var searchCriteria = {"objectId" : userId};
          this.search(searchCriteria, function(err, list){
              //callback(err, list)
              callback(err, list)
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
      }
  };

  //var CustomController = Object.create(MyOwnController); //create copy
  MyOwnController.__proto__ = BaseController;
      //MyOwnController.find("Sample Custom controller");
  module.exports = MyOwnController;
