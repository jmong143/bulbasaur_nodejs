//Sample Implementation
  var BaseController = require('../controllers/BaseCRUDController')("banner");
//    var Controller = require('../controllers/BaseCRUDController')(model);
  var MyOwnController = {
      method1 : function(){
        console.log("ako ay isang CustomController at may method 1");
      },
      method2 : function(){
        console.log("ako ay isang CustomController at may method 2");
        return "AKO AY NASA METHOD 2";
      },
      method3 : function(){
        console.log("ako ay isang CustomController at may method 2");
      }
  };

  //var CustomController = Object.create(MyOwnController); //create copy
  MyOwnController.__proto__ = BaseController;
      //MyOwnController.find("Sample Custom controller");
  module.exports = MyOwnController;
