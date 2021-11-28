const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Types = mongoose.SchemaTypes
const Product = require('./Product');

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  favorites: [{type: Types.ObjectId, ref: 'Product'}],
  cart: [{type: Types.ObjectId, ref: 'Product'}],
  createdDate: {type: Date, default: Date.now},
  hash: {type: String, required: true},
  role: {
    type: String,
    default: 'user',
    required: true
  }
});
//we dont need to send id and hash to Front
UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret.hash;
  }
});
const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;