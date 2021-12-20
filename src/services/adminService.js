const Currency = require('../models/Currency')
const Product = require('../models/Product')
const NotFoundError = require("../errors/NotFoundError");
const UnprocessableError = require("../errors/UnprocessableError");


class AdminService {
  async changeCurrency(newCode) {
    console.log(newCode);
    const currency = await Currency.findOne({code: newCode});
    if (!currency) throw new NotFoundError('no such currency');
   const {rate, inverseRate, minorUnit, code} = currency
    console.log(currency);
    await Currency.updateOne({name: 'current'}, {$set: {rate, code, inverseRate, minorUnit, name: 'current'}})
    const result = await Product.updateMany({}, [
      {
        $set: {
          "price.code": currency.code,
          "price.amount": {$round: [{$multiply: [currency.rate, "$base_price"]}, currency.minorUnit]},
          "price_discount": {$round: [{$multiply: [currency.rate, "$base_price_discount"]}, currency.minorUnit]}
        }
      }])
    console.log(result);
    return result;
  }

  async addProduct(product) {
    const currency = await Currency.findOne({name: 'current'});
    const {rate, code} = currency
    const newProduct = {...product};
    newProduct.price = {};
    newProduct.price.amount = rate * Number(newProduct.base_price);
    newProduct.price.code = code;
    newProduct.price_discount = rate * Number(newProduct.base_price_discount);
    if (newProduct.order > 0) {
      newProduct.has_order = true;
    } else {
      delete newProduct.order;

    }
    if (newProduct.price.amount < newProduct.price_discount) {
      throw new UnprocessableError('discount price cannot be < then base price')
    }
    const mongoProduct = new Product(newProduct);
    return await mongoProduct.save();
  }

  async updateProduct(product_id, product) {
    const currency = await Currency.findOne({name: 'current'});
    const {rate, code} = currency
    const updateProduct = {...product};
    updateProduct.price = {};
    updateProduct.price.amount = rate * Number(updateProduct.base_price);
    updateProduct.price.code = code;
    updateProduct.price_discount = rate * Number(updateProduct.base_price_discount);
    if (updateProduct.price.amount < updateProduct.price_discount) {
      throw new UnprocessableError('price can not be smaller than discount price ')
    }
    let update;
    if (updateProduct && updateProduct.order > 0) {
      update = {$set: {...updateProduct, has_order: true}};
    } else {
      delete updateProduct.order;
      update = {$set: {...updateProduct, has_order: false}, $unset: {order: ""}}
    }
    return Product.updateOne({_id: product_id}, update);
  }
}

module.exports = new AdminService();
