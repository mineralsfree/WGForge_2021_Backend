const express = require('express');
const router = express.Router();

const adminService = require('../services/adminService')
const UnprocessableError = require("../errors/UnprocessableError");
const NotFoundError = require("../errors/NotFoundError");

/**
 * @swagger
 * /api/admin/settings/currency:
 *  put:
 *   tags:
 *     - admin
 *   summary: Change currency for store
 *   parameters:
 *   - name: Authorization
 *     in: header
 *     description: an authorization header "Bearer 'access token'"
 *     required: true
 *     type: string
 *     value: Bearer
 *   - name: params
 *     in: body
 *     schema:
 *       type: object
 *       properties:
 *         currencyCode:
 *           type: string
 *           required: true
 *       example:
 *         currencyCode: BYN
 *   responses:
 *       200:
 *         description: Successful request
 *       403:
 *         description: Access forbidden
 */
router.put('/settings/currency', async (req, res, next) => {
  try {
    const currencyCode = req.body.currencyCode;
    const result = await adminService.changeCurrency(currencyCode)
    res.json(result);
  } catch (e) {
    next(e);
  }
})


/**
 * @swagger
 * /api/admin/product:
 *  post:
 *   tags:
 *     - admin
 *   summary: Add product to store
 *   parameters:
 *   - name: Authorization
 *     in: header
 *     description: an authorization header "Bearer 'access token'"
 *     required: true
 *     type: string
 *     value: Bearer
 *   - name: params
 *     in: body
 *     schema:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           required: true
 *         type:
 *           type: string
 *           required: true
 *         details:
 *           type: string
 *           required: true
 *         base_price:
 *           type: number
 *           required: true
 *       example:
 *         name: t-43
 *         type: vehicle
 *         details: cool tank
 *         base_price: 123
 *         tier: 1
 *         nation: uk
 *         tank_type: heavyTank
 *   responses:
 *     200:
 *       description: Successful request
 *     422:
 *       description: Unprocessable entity
 */
router.post('/product', async (req, res, next) => {
  const product = req.body;
  try {
    const result = await adminService.addProduct(product);
    return res.json(result);
  } catch (e) {
    next(new UnprocessableError(e))
  }

})

/**
 * @swagger
 * /api/admin/product/{product_id}:
 *  put:
 *   tags:
 *     - admin
 *   summary: Update product to store
 *   parameters:
 *   - name: Authorization
 *     in: header
 *     description: an authorization header "Bearer 'access token'"
 *     required: true
 *     type: string
 *     value: Bearer
 *   - name: product_id
 *     in: path
 *     description: ID of product to add to favorites
 *     required: true
 *     type: string
 *   - name: params
 *     in: body
 *     schema:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           required: true
 *         type:
 *           type: string
 *           required: true
 *         details:
 *           type: string
 *           required: true
 *         base_price:
 *           type: number
 *           required: true
 *       example:
 *         name: t-43
 *         type: vehicle
 *         details: cool tank
 *         base_price: 123
 *         tier: 1
 *         nation: uk
 *         tank_type: heavyTank
 *   responses:
 *     200:
 *       description: Successful request
 *     422:
 *       description: Unprocessable entity
 */
router.put('/product/:product_id', async (req, res, next)=>{
  const {product_id} = req.params;
  const product =   req.body;
  try {
    const result = await adminService.updateProduct(product_id, product);
    res.json({success: true});
  } catch (e){
    console.error(e);
    next(new UnprocessableError(e));
  }
})
/**
 * @swagger
 * /api/admin/product/{product_id}:
 *  delete:
 *   tags:
 *     - admin
 *   summary: Delete product from store
 *   parameters:
 *   - name: Authorization
 *     in: header
 *     description: an authorization header "Bearer 'access token'"
 *     required: true
 *     type: string
 *     value: Bearer
 *   - name: product_id
 *     in: path
 *     description: ID of product to add to favorites
 *     required: true
 *     type: string
 *   responses:
 *     200:
 *       description: Successful request
 *     404:
 *       description: Product not found
 */
router.delete('/product/:product_id', async (req, res, next)=>{
  const {product_id} = req.params;
  try {
     await adminService.deleteProduct(product_id);
    res.json({success: true});
  } catch (e){
    next(new NotFoundError(e));
  }
})
module.exports = router