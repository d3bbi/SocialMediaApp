const { model, Schema } = require('mongoose');
/*see mongoose schema on https://mongoosejs.com/docs/schematypes.html#schematypes */

const postSchema = new Schema({
    body: String,
    username: String,
    createdAt: String,
    comments: [
      {
        body: String,
        username: String,
        createdAt: String
      }
    ],
    likes: [
      {
        username: String,
        createdAt: String
      }
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    }
  });
  
  module.exports = model('Post', postSchema);