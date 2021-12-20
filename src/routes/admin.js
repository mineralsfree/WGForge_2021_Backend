const express = require('express');
const router = express.Router();

const adminService = require('../services/adminService')
const UnprocessableError = require("../errors/UnprocessableError");

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
 *   summary: Add product to cart
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
 * /api/admin/product/{product_id}/order:
 *  put:
 *   tags:
 *     - admin
 *   summary: Change order for product
 *   parameters:
 *   - name: Authorization
 *     in: header
 *     description: an authorization header "Bearer 'access token'"
 *     required: true
 *     type: string
 *     value: Bearer
 *   - name: product_id
 *     in: path
 *     description: ID of product to remove from cart
 *     required: true
 *     type: string
 *   - name: params
 *     in: body
 *     schema:
 *       type: object
 *       properties:
 *         order:
 *           type: number
 *           required: true
 *       example:
 *         order: 2
 *   responses:
 *     200:
 *       description: Successful request
 *     403:
 *       description: Access forbidden
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
module.exports = router