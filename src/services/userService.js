const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User')
const Product = require('../models/Product')
const ValidationError = require("../errors/ValidationError");
const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");

class UserService {
  async authenticateUser({email, password}) {
    const user = await User.findOne({email});
    if (user && bcrypt.compareSync(password, user.hash)) {
      const token = jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '31d'});
      return {token}
    } else {
      throw new UnauthorizedError('login or password is incorrect')
    }
  }

  async getUser(id) {
    const user =  User.findOne({_id: id}).populate('favorites cart');
    if (!user){
      throw new NotFoundError('No user with such id');
    }
    return user;
  }

  async createUser(user) {
    if (await User.findOne({email: user.email})) {
      throw new UnauthorizedError('User with this email already registered');
    }
    const newUser = new User(user);
    newUser.hash = bcrypt.hashSync(user.password, 10)
    return await newUser.save();
  }

  async addToFavorites(id, productId) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new NotFoundError('No product with this id');
    }
    const result = await User.updateOne({
        _id: id,
      },
      {$addToSet: {'favorites': product._id}}
    );
    if (!result || result.modifiedCount !== 1) {
      throw new ValidationError('Product was not added');
    }
    return result;
  }

  async removeFromFavorites(id, productId) {
    const result = await User.updateOne({
      _id: id,
    }, {$pull: {'favorites': productId}});
    if (!result || result.modifiedCount !== 1) {
      throw new NotFoundError('Product was not removed');
    }
  }
  async addToCart(id, productId){
    const product = await Product.findById(productId);
    if (!product) {
      throw new NotFoundError('No product with this id');
    }
    const result = await User.updateOne({
      _id: id,
    },{$addToSet: {'cart': product._id}}
    )
    if (!result || result.modifiedCount !== 1) {
      throw new NotFoundError('Product was not added to cart');
    }
    return result;
  }
  async removeFromCart(id, productId){
    const result = await User.updateOne({
      _id: id,
    }, {$pull: {'cart': productId}});
    if (!result || result.modifiedCount !== 1) {
      throw new NotFoundError('Product was not removed');
    }
  }
}

module.exports = new UserService();