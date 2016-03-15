// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var postSchema = new Schema({
  productName: String,
  //username: { type: String, required: true, unique: true },
  category: String,
  condition:  String,
  createdBy : { type: Schema.Types.ObjectId, ref: 'User' },
  objectId : String,
  description: String,
  oldPostId: String,
  oldUserId: String,
  photos: [String],
  price: String,
  searchPostKey: String,
  searchDetailsKey: String,
  is_archived: Boolean,
  is_viewed: Boolean,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// the schema is useless so far
// we need to create a model using it
var Post = mongoose.model('Post', postSchema);
// make this available to our users in our Node applications

module.exports = Post;
