const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    order:{
      type: Number,
      unique: true,
      min: 1,
      sparse: true,
      max: 99999
    },
    has_order: {
      type: Boolean,
      default: false
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
      min: 0,
      type: Number,
      required: true
    },
    base_price_discount: {
      min: 0,
      type: Number,
      required: true,
      default: function(){return this.base_price},
    },
    price: {
      code: {type: String, required: true, default: "USD"},
      amount: {
        min: 0,
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
    discount_show_type:{
      type: String,
      required: true,
      default: 'percent',
      enum: ['percent', 'absolute']
    },
    price_discount: {
      min: 0,
      type: Number,
      required: true,
      default:  function(){return this.base_price_discount}
    }
  },
  {
    toJSON: {getters: true}
  });
const ProductModel = mongoose.model('Product', ProductSchema);
ProductModel.createIndexes();
module.exports = ProductModel;