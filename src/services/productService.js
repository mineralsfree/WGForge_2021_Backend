const Product = require('../models/Product');


class ProductService {
  async getProducts() {
    return Product.find({}, null, {limit: 60}).sort({has_order: 'desc', order: 'asc' })
  }
}

module.exports = new ProductService();