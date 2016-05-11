// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create a schema
var userSchema = new Schema({
  name: String,
  //username: { type: String, required: true, unique: true },
  username: { type: String, required: true},
  password: { type: String, required: true },
  objectId: String,
  admin: Boolean,
  address: String,
  fullname: String,
  email: String,
  emailVerified: Boolean,
  //birthdate: String,
  birthdate: {
    __type : {type: String, default: "Date"},
    iso : Date
  },
  contact: String,
  avatar: String,
  coverPhoto: String,
  createdAt : Date,
  updatedAt : Date
});


userSchema.statics.userKill = function(){
  return "USER KILL!!!";
};


// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);
// make this available to our users in our Node applications
module.exports = User;
