const Product = require('../models/Product');


class ProductService {
  async getProducts(){
    return Product.find({}, null, {limit: 60});
  }
}

module.exports = new ProductService();