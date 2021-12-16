const express = require('express');
const userService = require('../services/userService')
const router = express.Router();
const {body, validationResult} = require('express-validator');

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
  try {
    const user = await userService.getUser(userId);
    res.json(user);
  } catch (e) {
    next(e);
  }
})


/**
 * @swagger
 * /api/user/favorites/{product_id}:
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
 *   - name: product_id
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

router.put('/favorites/:product_id', async (req, res, next) => {
  try {
    const {product_id} = req.params;
    const userId = req.user.id;
    await userService.addToFavorites(userId, product_id);
    res.json({success: true});
  } catch (e) {
    next(e)
  }
})

/**
 * @swagger
 * /api/user/favorites/{product_id}:
 *  delete:
 *   tags:
 *     - user
 *   summary: removes product from user's favorites
 *   parameters:
 *   - name: Authorization
 *     in: header
 *     description: an authorization header "Bearer 'access token'"
 *     required: true
 *     type: string
 *     value: Bearer
 *   - name: product_id
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
router.delete('/favorites/:product_id', async (req, res, next) => {
  try {
    const {product_id} = req.params;
    const userId = req.user.id;
    await userService.removeFromFavorites(userId, product_id);
    res.json({success: true});
  } catch (e) {
    next(e)
  }
})
/**
 * @swagger
 * /api/user/cart/{product_id}:
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
 *   - name: product_id
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
router.put('/cart/:product_id', async (req, res, next) => {
  try {
    const {product_id} = req.params;
    const userId = req.user.id;
    await userService.addToCart(userId, product_id);
    res.json({success: true});

  } catch (e) {
    next(e)
  }
})
/**
 * @swagger
 * /api/user/cart/{product_id}:
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
 *   - name: product_id
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
router.delete('/cart/:product_id', async (req, res, next) => {
  try {
    const {product_id} = req.params;
    const userId = req.user.id;
    await userService.removeFromCart(userId, product_id);
    res.json({success: true});
  } catch (e) {
    next(e)
  }
})
module.exports = router;
