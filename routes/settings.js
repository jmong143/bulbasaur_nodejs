var express = require('express');
var router = express.Router();
var configureRouting = require('../services/RouteService');

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
//CustomController codes here
var WhateverController = require('../controllers/CustomController');
router.get('/blahblah1' , function(req, res, next) {
  /*
    WhateverController.view("56d00792e0816af8064c3a0c", function(err, results){
        res.send("WHATEVER CONTROLLER : " + JSON.stringify(results) + "===" + WhateverController.method2());
    });
  */
});

var AuthenticationController = require('../controllers/AuthenticationController');
router.get('/custom-auth' , function(req, res, next) {
  /*
    WhateverController.view("56d00792e0816af8064c3a0c", function(err, results){
        res.send("WHATEVER CONTROLLER : " + JSON.stringify(results) + "===" + WhateverController.method2());
    });
  */
  AuthenticationController.login(function(string){
    res.send("LOGIN..." + string);
  });
});


module.exports = router;
