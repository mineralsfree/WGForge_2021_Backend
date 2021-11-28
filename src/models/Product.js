const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
    tier: {
      type: Number,
    },
    type: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    nation: {
      type: String,
    },
    images: [String],
    details: {
      type: String,
      required: true,
    },
    tank_type: {
      type: String,
    },
    base_price: {
      type: Number,
      required: true
    },
    base_price_discount: {
      type: Number,
      required: true
    },
    price: {
      code: {type: String, required: true},
      amount: {
        type: Number,
        required: true
      },
    },
    discount: {
      type: Number,
      required: true
    },
    price_discount: {
      type: Number,
      required: true,
    }
  },
  {
    toJSON: {getters: true}
  });
const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;