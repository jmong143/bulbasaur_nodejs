var formatJSONResponse = function(multi, errorResponse, data){
    var multiResult = multi || true;
    var responseJSON = {};
    if(multi)
        responseJSON.results = data;
    else
        responseJSON.result = data;

    if(errorResponse){
        responseJSON.message = {
          result : "error",
          msg: JSON.stringify(errorResponse)
        }
    }else{
      responseJSON.message = {
        result : "success",
        msg: "SUCCESSFUL"
      }
    }
    return responseJSON;
};

var configureRouting = function(_router, _route, controller, listFields){
 controller.listFields = listFields||{};
  /*
  SEARCH FROM RECORDS WITH GIVEN PARAMETER(s)
  */
  _router.get( "/" + _route + "/search" , function(req, res, next) {
     var fieldsAndData = req.query;
      controller.search(fieldsAndData, function(err, results){
           console.log("--->>>>" + JSON.stringify(controller.listFields));
           res.send( formatJSONResponse(true, err, results));
           //res.send(  results);
       });
  });

  /*
  LIST ALL RECORDS
  */
  _router.get( "/" + _route , function(req, res, next) {
    var fieldsAndData = req.query;
      controller.search(fieldsAndData, function(err, results){
           res.send( formatJSONResponse(true, err, results) );
       });
  });

  /*
  CREATE NEW RECORD
  REQUEST TYPE: POST
  */
  _router.post( "/" + _route , function(req, res, next) {
     var fieldsAndData = req.body;//from POST/PUT request
      controller.save(fieldsAndData, function(err, result){
        res.send( formatJSONResponse(false, err, result) );
       });
  });

  /*
  VIEW RECORD WITH GIVEN ID
  REQUEST TYPE: GET
  */
  _router.get( "/" + _route + "/:id" , function(req, res, next) {
      var id = req.params.id;
      controller.view(id, function(err, result){
           res.send( formatJSONResponse(false, err, result) );
      });
  });

  /*
  UPDATE RECORD WITH GIVEN ID
  REQUEST TYPE: PUT
  */
  _router.put( "/" + _route + "/:id" , function(req, res, next) {
    var id = req.params.id;
    var fieldsAndData = req.body;//from POST/PUT request
     //function(id , fieldsAndData , callback){
      controller.update(id, fieldsAndData , function(err, result){
          res.send( formatJSONResponse(false, err, result) );
       });
  });
  /*
  DELETE RECORD WITH GIVEN ID
  REQUEST TYPE: DELETE
  */
  _router.delete( "/" + _route + "/:id" , function(req, res, next) {
      var id = req.params.id;
      controller.delete(id, function(err, result){
           res.send( formatJSONResponse(false, err, result) );
       });

  });
  return _router;
}

module.exports = configureRouting;
