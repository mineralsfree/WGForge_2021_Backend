const {Router} = require('express');
const user = require('./user');
const product = require('./product')
const admin = require('./admin');


const router = Router();
router.use('/user', user);
router.use('/admin', admin);
router.use('/products', product)
module.exports = router;