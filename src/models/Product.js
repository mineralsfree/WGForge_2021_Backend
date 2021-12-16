const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    priority:{
      type: Number
    },
    tier: {
      type: Number,
      required: function (){return this.type === 'vehicle'},
      enum: [5, 8, 1, 6, 3, 7, 2, 4, 9, 10, 0]
    },
    type: {
      type: [String],
      required: true,
      enum: ['vehicle', 'gold', 'premium', 'loot']
    },
    name: {
      type: String,
      required: true
    },
    nation: {
      type: String,
      required: function (){return this.type === 'vehicle'},
      enum: ['ussr', 'usa', 'china', 'uk', 'czech', 'sweden', 'poland', 'italy', 'germany', 'france', 'japan', 'merc', 'xn']
    },
    images: [String],
    details: {
      type: String,
      required: true,
    },
    tank_type: {
      type: String,
      required: function (){return this.type === 'vehicle'},
      enum: ['mediumTank', 'heavyTank', 'lightTank', 'AT-SPG', 'SPG']
    },
    base_price: {
      type: Number,
      required: true
    },
    base_price_discount: {
      type: Number,
      required: true,
      default: function(){return this.base_price},
    },
    price: {
      code: {type: String, required: true, default: "USD"},
      amount: {
        default:  function(){return this.base_price},
        type: Number,
        required: true
      },
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
      default: 0
    },
    price_discount: {
      type: Number,
      required: true,
      default:  function(){return this.base_price_discount}
    }
  },
  {
    toJSON: {getters: true}
  });
const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;