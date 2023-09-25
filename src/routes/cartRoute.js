const express = require('express');

const {
  addProductToCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  clearCart,
  updateCartItemQuantity,
  applyCoupon,
  removeSpecificCartProduct,
} = require('../services/cartService');
const authService = require('../services/authService');

const router = express.Router();

router.use(authService.protect, authService.allowedTo('user','admin','company'));
router
  .route('/')
  .post(addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearCart);

router.put('/applyCoupon', applyCoupon);

router
  .route('/:itemId')
  .put(updateCartItemQuantity)
  .delete(removeSpecificCartItem);

  router
  .route('/product/:productId')
  .delete(removeSpecificCartProduct);

module.exports = router;
