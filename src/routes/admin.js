const express = require('express');
const router = express.Router();

const ROLE = require('../const/roles')
const adminService = require('../services/adminService')

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
router.put('/settings/currency', async (req, res, next)=>{
  try {
    if (req.user.role !==ROLE.ADMIN){
      next({name: 'AccessError'})
    }
    const currencyCode = req.body.currencyCode;
    const result = await adminService.changeCurrency(currencyCode)
    res.json(result);
  } catch (e){
    next(e);
  }

})
module.exports = router