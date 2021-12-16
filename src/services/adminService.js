const Currency = require('../models/Currency')
const Product = require('../models/Product')
const NotFoundError = require("../errors/NotFoundError");


class AdminService {
  async changeCurrency(code) {
    const currency = await Currency.findOne({code});
    if (!currency) throw new NotFoundError('no such currency');
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
  async addProduct(product){
    const newProduct = new Product(product);
    return await newProduct.save();
  }
  async setPriority(product_id, order){
  return Product.updateOne({_id: product_id}, {priority: order});

  }
}

module.exports = new AdminService();
