var secret = "jdjfsdjfg4r59848932fnjkfsiudf";
var jwt = require('jwt-simple');
//The supported algorithms for encoding and decoding are HS256, HS384, HS512 and RS256.ar secret = 'xxx';
var Tokenizer = {
  sign : function(data){
      // encode
      var token = jwt.encode(data, secret);

      return token;
  },

  verify : function(req, res, next){
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    // decode token
    if (token) {
      // verifies secret and checks exp
          verifyToken(token, secret, function(err, decoded) {
          if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });
          } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;
            next();
          }
        });

    } else {
      // if there is no token
      // return an error
      return res.status(403).send({
          success: false,
          message: 'No token provided.'
      });
    }
  }
}

function   verifyToken(token, secret, callback){
    var decoded = jwt.decode(token, secret);
    var err = null;
    callback(err, decoded);
}

module.exports = Tokenizer;
