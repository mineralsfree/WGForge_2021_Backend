const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CurrencySchema = new Schema({
  name: String,
  code: String,
  rate: Number,
  date: Date,
  inverseRate: Number,
  minorUnit: Number
})
const CurrencyModel  = mongoose.model('Currency', CurrencySchema)
module.exports = CurrencyModel;
