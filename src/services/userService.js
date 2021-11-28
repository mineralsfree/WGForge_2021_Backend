const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User')
const Product = require('../models/Product')
const errorTypes = require("../const/errorTypes");

class UserService {
  async authenticateUser({email, password}) {
    const user = await User.findOne({email});
    if (user && bcrypt.compareSync(password, user.hash)) {
      const token = jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '31d'});
      return {token}
    } else {
      throw 'login or password is incorrect'
    }
  }

  async getUser(id) {
    return User.findOne({_id: id}).populate('favorites cart',);
  }

  async createUser(user) {
    if (await User.findOne({email: user.email})) {
      throw 'User already registered';
    }
    const newUser = new User(user);
    newUser.hash = bcrypt.hashSync(user.password, 10)
    return await newUser.save();
  }

  async addToFavorites(id, productId) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('No product with this id').name = errorTypes.NOT_FOUND;
    }
    const result = await User.updateOne({
        _id: id,
      },
      {$addToSet: {'favorites': product._id}}
    );
    if (!result || result.modifiedCount !== 1) {
      throw new Error('Product was not added').name = errorTypes.VALIDATION_ERROR;
    }
    return result;
  }

  async removeFromFavorites(id, productId) {
    const result = await User.updateOne({
      _id: id,
    }, {$pull: {'favorites': productId}});
    if (!result || result.modifiedCount !== 1) {
      throw (new Error('Product was not removed').name = errorTypes.VALIDATION_ERROR);
    }
  }
  async addToCart(id, productId){
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('No product with this id').name = errorTypes.NOT_FOUND;
    }
    const result = await User.updateOne({
      _id: id,
    },{$addToSet: {'cart': product._id}}
    )
    if (!result || result.modifiedCount !== 1) {
      throw new Error('Product was not added to cart').name = errorTypes.VALIDATION_ERROR;
    }
    return result;
  }
  async removeFromCart(id, productId){
    const result = await User.updateOne({
      _id: id,
    }, {$pull: {'cart': productId}});
    if (!result || result.modifiedCount !== 1) {
      throw (new Error('Product was not removed').name = errorTypes.VALIDATION_ERROR);
    }
  }
}

module.exports = new UserService();