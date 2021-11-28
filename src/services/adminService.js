const Currency = require('../models/Currency')
const Product = require('../models/Product')
const errorTypes = require("../const/errorTypes");


class AdminService {
  async changeCurrency(code) {
    const currency = await Currency.findOne({code});
    if (!currency) throw {name: errorTypes.NOT_FOUND, message: 'no such currency'};
    console.log(currency);
    const result = await Product.updateMany({}, [
      {
        $set: {
          "price.code": currency.code,
          "price.amount": {$round: [{$multiply: [currency.rate, "$base_price"]}, currency.minorUnit]},
          "price_discount": {$round: [{$multiply: [currency.rate, "$base_price_discount"]}, currency.minorUnit]}
        }
      }])
    return result;

  }
}

module.exports = new AdminService();
