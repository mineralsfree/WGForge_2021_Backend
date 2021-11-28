const express = require('express');
const ProductService = require('../services/productService')
const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags:
 *       - products
 *     description: returns available products
 *     responses:
 *       200:
 *         description: Successful request
 */
router.get('/',async (req,res)=>{
    const products =  await ProductService.getProducts();
    res.json(products);
})

module.exports = router;