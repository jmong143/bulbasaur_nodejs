var User = require('../../ipostmo-nodejs-mongo-base/model/test');
//var authService = require('../services/AuthenticationService');

exports = function(){
    console.log("I was called as an export");
}

exports.login = function(callback){
  User.find({},function (err, kittens) {
    if (err) return console.error(err);
      callback(kittens);
  });
}

exports.register = function(){
      console.log("Register called.");
}

module.exports = exports;
