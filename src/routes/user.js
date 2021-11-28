const express = require('express');
const userService = require('../services/userService')
const router = express.Router();
const {body, validationResult, query} = require('express-validator');
const errorTypes = require("../const/errorTypes");

/**
 * @swagger
 * /api/user/auth:
 *   post:
 *     tags:
 *       - user
 *     description: Login both admins and users, save token, to make authorized requests
 *     consumes:
 *        - application/json
 *     parameters:
 *      - in: body
 *        name: params
 *        schema:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *              required: true
 *            password:
 *              type: string
 *              required: true
 *          example:
 *            email: example@example.com
 *            password: longerThen5
 *     responses:
 *       200:
 *         description: Successful request
 *       400:
 *         description: Incorrect login or password
 */
router.post('/auth', async (req, res, next) => {
  try {
    const result = await userService.authenticateUser(req.body);
    res.json(result);
  } catch (e) {
    next(e);
  }
})

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     tags:
 *       - user
 *     description: Endpoint to register new regular users
 *     consumes:
 *        - application/json
 *     parameters:
 *      - in: body
 *        name: params
 *        schema:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *              required: true
 *            password:
 *              type: string
 *              required: true
 *          example:
 *            email: example@example.com
 *            password: longerThen5
 *     responses:
 *       200:
 *         description: Successful request
 *       400:
 *         description: Bad input parameters
 */
router.post('/register',
  body('email').isEmail(),
  //TODO: make more password rules
  body('password').isLength({min: 5}),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    const user = req.body;
    try {
      await userService.createUser(user);
      return res.json({success: true});
    } catch (e) {
      next(e);
    }

  })
/**
 * @swagger
 * /api/user:
 *  get:
 *   tags:
 *     - user
 *   summary: Get user info
 *   parameters:
 *   - name: Authorization
 *     in: header
 *     description: an authorization header "Bearer 'access token'"
 *     required: true
 *     type: string
 *     value: Bearer
 *   responses:
 *       200:
 *         description: Successful request
 *       400:
 *         description: Not allowed
 */
router.get('/', async (req, res, next) => {
  const userId = req.user.id;
  if (userId) {
    const user = await userService.getUser(userId);
    res.json(user);
  } else {
    throw new Error('Unauthorized')
  }
})


/**
 * @swagger
 * /api/user/favorites/{id_product}:
 *  put:
 *   tags:
 *     - user
 *   summary: adds product to user's favorites
 *   parameters:
 *   - name: Authorization
 *     in: header
 *     description: an authorization header "Bearer 'access token'"
 *     required: true
 *     type: string
 *     value: Bearer
 *   - name: id_product
 *     in: path
 *     description: ID of product to add to favorites
 *     required: true
 *     type: string
 *   responses:
 *       200:
 *         description: Successful request
 *       404:
 *         description: Product not found
 */

router.put('/favorites/:id_product', async (req, res, next) => {
  try {
    const {id_product} = req.params;
    const userId = req.user.id;
    if (userId) {
      await userService.addToFavorites(userId, id_product);
      res.json({success: true});
    } else {
      next(new Error("Token is invalid").name = errorTypes.UNAUTHORIZED_ERROR);
    }
  } catch (e) {
    next(e)
  }
})

/**
 * @swagger
 * /api/user/favorites/{id_product}:
 *  delete:
 *   tags:
 *     - user
 *   summary: Get user info
 *   parameters:
 *   - name: Authorization
 *     in: header
 *     description: an authorization header "Bearer 'access token'"
 *     required: true
 *     type: string
 *     value: Bearer
 *   - name: id_product
 *     in: path
 *     description: ID of product to remove from favorites
 *     required: true
 *     type: string
 *   responses:
 *       200:
 *         description: Successful request
 *       404:
 *         description: Product not found
 */
router.delete('/favorites/:id_product', async (req, res, next) => {
  try {
    const {id_product} = req.params;
    const userId = req.user.id;
    if (userId) {
      await userService.removeFromFavorites(userId, id_product);
      res.json({success: true});
    } else {
      next(new Error("Token is invalid").name = errorTypes.UNAUTHORIZED_ERROR);
    }
  } catch (e) {
    next(e)
  }
})
/**
 * @swagger
 * /api/user/cart/{id_product}:
 *  put:
 *   tags:
 *     - user
 *   summary: adds product to user's cart
 *   parameters:
 *   - name: Authorization
 *     in: header
 *     description: an authorization header "Bearer 'access token'"
 *     required: true
 *     type: string
 *     value: Bearer
 *   - name: id_product
 *     in: path
 *     description: ID of product to add to cart
 *     required: true
 *     type: string
 *   responses:
 *       200:
 *         description: Successful request
 *       404:
 *         description: Product not found
 */
router.put('/cart/:id_product', async(req, res, next)=>{
  try {
    const {id_product} = req.params;
    const userId = req.user.id;
    if (userId) {
      await userService.addToCart(userId, id_product);
      res.json({success: true});
    } else {
      next(new Error("Token is invalid").name = errorTypes.UNAUTHORIZED_ERROR);
    }
  } catch (e) {
    next(e)
  }
})
/**
 * @swagger
 * /api/user/cart/{id_product}:
 *  delete:
 *   tags:
 *     - user
 *   summary: removes product from user's cart
 *   parameters:
 *   - name: Authorization
 *     in: header
 *     description: an authorization header "Bearer 'access token'"
 *     required: true
 *     type: string
 *     value: Bearer
 *   - name: id_product
 *     in: path
 *     description: ID of product to remove from cart
 *     required: true
 *     type: string
 *   responses:
 *       200:
 *         description: Successful request
 *       404:
 *         description: Product not found
 */
router.delete('/cart/:id_product', async (req, res, next)=>{
  try {
    const {id_product} = req.params;
    const userId = req.user.id;
    if (userId) {
      await userService.removeFromCart(userId, id_product);
      res.json({success: true});
    } else {
      next(new Error("Token is invalid").name = errorTypes.UNAUTHORIZED_ERROR);
    }
  } catch (e) {
    next(e)
  }
})
module.exports = router;
