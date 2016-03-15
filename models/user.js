// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserInfo = new Schema({
  username:String,
  oldUserId:String,
  objectId: String,
  fullname:String,
  emailVerified:Boolean,
  email:String,
  //createdAt:Date,
  password:String,
  address: String,
  //sessionToken:String,
  //updatedAt:Date,
},{ _id : false });

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
  birthdate: String,
  contact: String,
  avatar: String,
  results: [UserInfo]
  /*created_at: Date,
  updated_at: Date */
});


userSchema.statics.userKill = function(){
  return "USER KILL!!!";
};


// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);
// make this available to our users in our Node applications
module.exports = User;
