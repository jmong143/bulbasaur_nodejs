
var BaseCRUDController = {
  name: null,
  model: null,
  route: "",
  listFields: {},
  index: function(callback){
    console.log(this.listFields);
    this.model.find({},function (err, list) {
        callback(err, list);
    });
  },
  view: function(id, callback){
    this.model.findById(id,function (err, singleObject) {
        callback(err, singleObject);
    });
  },
  save: function(obj, callback){
    var mod = this.model;
    var newObject = new mod(obj);
    newObject.save(function (err, singleObject) {
        callback(err, singleObject);
    });
  },
  /*
  SAMPLE:
  id: "somerandomalphanumeric"
  fieldsAndData: {field1: "field1", field2: "field2"}
  */
  update: function(id , fieldsAndData , callback){
    this.model.findByIdAndUpdate(id, { $set: fieldsAndData} ,function (err, singleObject) {
        callback(err, singleObject);
    });
  },
  delete: function(id, callback){
    this.model.findByIdAndRemove(id,function (err, singleObject) {
        callback(err, singleObject);
    });
  },
  search: function(seachCriteria, callback){
    console.log(this.listFields);
    var lf = this.listFields;
    console.log("SEARCH CRITERIA: " + JSON.stringify(seachCriteria));
    this.model.find(seachCriteria,  function (err, list) {
        //console.log("HERE.... " + this.listFields);
        callback(err, list);
    }).limit(10);
  }
}

module.exports = function(modelName){
  var model = require('../models/' + modelName);//model must exist
  var EmptyController = {};
  var Controller = Object.create(BaseCRUDController);
    Controller.__proto__ = BaseCRUDController;
    Controller.model = model;
    Controller.name = model || null;
    console.log("MODEL NAME:: " + modelName);
  return Controller;
}
