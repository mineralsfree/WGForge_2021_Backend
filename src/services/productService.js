const Product = require('../models/Product');


class ProductService {
  async getProducts() {
    return Product.find({}, null).sort({has_order: 'desc', order: 'asc' })
  }
}

module.exports = new ProductService();