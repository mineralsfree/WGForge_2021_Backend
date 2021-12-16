const {Router} = require('express');
const user = require('./user');
const product = require('./product')
const admin = require('./admin');
const ROLE = require("../const/roles");
const AccessForbiddenError = require('../errors/ForbiddenError')

const router = Router();
router.use('/user', user);
router.use('/admin',(req,res,next)=>{
  if (req.user.role !==ROLE.ADMIN){
    throw new AccessForbiddenError('Access Forbidden');
  } else {
    next();
  }
}, admin);
router.use('/products', product)
module.exports = router;