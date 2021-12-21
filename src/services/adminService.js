const Currency = require('../models/Currency')
const Product = require('../models/Product')
const NotFoundError = require("../errors/NotFoundError");
const UnprocessableError = require("../errors/UnprocessableError");
const mongoose = require('mongoose');
const User = require("../models/User");


class AdminService {
  async changeCurrency(newCode) {
    const session = await mongoose.startSession()
    session.startTransaction();
    let result;
    try {
      const currency = await Currency.findOne({code: newCode});
      if (!currency) throw new NotFoundError('no such currency');
      const {rate, inverseRate, minorUnit, code} = currency;
      await Currency.updateOne({name: 'current'}, {$set: {rate, code, inverseRate, minorUnit, name: 'current'}})
      result = await Product.updateMany({}, [
        {
          $set: {
            "price.code": currency.code,
            "price.amount": {$round: [{$multiply: [currency.rate, "$base_price"]}, currency.minorUnit]},
            "price_discount": {$round: [{$multiply: [currency.rate, "$base_price_discount"]}, currency.minorUnit]}
          }
        }
      ])
      await session.commitTransaction();
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw error;
    }
    return result;
  }

  async addProduct(product) {
    const currency = await Currency.findOne({name: 'current'});
    const {rate, code} = currency
    const base_price = Number(product.base_price)
    const base_price_discount = Number(product.base_price_discount);
    const newProduct = {...product};
    newProduct.price = {};
    newProduct.price.code = code;
    newProduct.price.amount = Number((rate * base_price).toFixed(currency.minorUnit));
    newProduct.price_discount = Number((rate * base_price_discount).toFixed(currency.minorUnit));
    if (newProduct.order > 0) {
      newProduct.has_order = true;
    } else {
      delete newProduct.order;

    }
    if (newProduct.price.amount <= newProduct.price_discount) {
      throw new UnprocessableError('discount price cannot be smaller or equal then base price')
    }
    const mongoProduct = new Product(newProduct);
    return await mongoProduct.save();
  }

  async updateProduct(product_id, product) {
    const currency = await Currency.findOne({name: 'current'});
    const {rate, code, minorUnit} = currency
    const base_price = Number((rate * product.base_price).toFixed(minorUnit));
    const base_price_discount = Number((rate * product.base_price_discount).toFixed(minorUnit))
    const {order} = product;
    if (base_price <= base_price_discount) {
      throw new UnprocessableError('price can not be smaller or equal than discount price')
    }
    delete product.order;
    let update = {
      $set: {
        ...product,
        "price.code": code,
        "price.amount": base_price,
        "price_discount": base_price_discount
      }
    };
    if (order > 0) {
      update.$set.has_order = true;
      update.order = order;
    } else {
      update.$set.has_order = false;
      update.$unset = {order: ""}
    }
    return Product.updateOne({_id: product_id}, update);
  }
  async deleteProduct(product_id){
    const session = await mongoose.startSession()
    session.startTransaction();
    try{
      await User.updateMany({}, {$pull: {'favorites': product_id, 'cart': product_id}});
      await Product.deleteOne({_id: product_id});
      await session.commitTransaction();
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw error;
    }
  }
}

module.exports = new AdminService();
