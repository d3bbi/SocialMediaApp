const { model, Schema } = require('mongoose');

/*see schemaTypes on https://mongoosejs.com/docs/schematypes.html#schematypes */
const userSchema = new Schema({
username: String,
password: String,
email: String,
createdAt: String,

});

module.exports = model('User', userSchema);