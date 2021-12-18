const Currency = require('../models/Currency')
const Product = require('../models/Product')
const NotFoundError = require("../errors/NotFoundError");
const UnprocessableError = require("../errors/UnprocessableError");


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

  async addProduct(product) {
    const {base_price_discount, base_price} = product;
    if (base_price_discount > 0 && base_price_discount > base_price) {
      throw new UnprocessableError('discount price cannot be < then base price')
    } else if (base_price_discount > 0){
        product.discount = Math.floor(1-(base_price_discount/base_price));
    }
    const newProduct = new Product(product);
    return await newProduct.save();
  }

  async setOrder(product_id, order) {

    const product = await Product.updateOne({_id: product_id}, {$set: {order: order, has_order: order > 0}})
    return product;
  }
}

module.exports = new AdminService();
