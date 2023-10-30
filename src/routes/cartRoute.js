const express = require('express');

const {
  addProductToCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  clearCart,
  updateCartItemQuantity,
  applyCoupon,
  removeSpecificCartProduct,
  addProductToCartWithoutLogin,
  getCartById,
  updateCartItemQuantityById,
  removeSpecificCartItemByCartId,
  getCartByGuestId,
  addProductToCartByQuestId
} = require('../services/cartService');
const authService = require('../services/authService');

const router = express.Router();

//router.use(authService.protect, authService.allowedTo('admin','company','user'));
router
  .route('/')
  .post(
    authService.protect,
    authService.allowedTo('user','admin','company'),
    addProductToCart)
  .get(
    authService.protect,
    authService.allowedTo('user','admin','company'),
    getLoggedUserCart)
  .delete(
    authService.protect,
    authService.allowedTo('user','admin','company'),
    clearCart
    );

    // start operations without login
    router
    .route('/:id')
    .post(
      addProductToCartWithoutLogin)
      .get(
        getCartById)

router.get('/guest/:id', getCartByGuestId);
router.post('/guest/:id', addProductToCartByQuestId);
router.put('/guest/:id', addProductToCartWithoutLogin);

router.put('/:id/byCart', updateCartItemQuantityById);
router.delete('/:id/byCart/:itemId', removeSpecificCartItemByCartId);

// end  operations without login
router.put('/applyCoupon', applyCoupon);

router
  .route('/:itemId')
  .put(
    authService.protect,
     authService.allowedTo('admin','company','user'),
    updateCartItemQuantity)
  .delete(
    authService.protect,
    authService.allowedTo('admin','company','user'),
    removeSpecificCartItem);

  router
  .route('/product/:productId')
  .delete(
    authService.protect,
    authService.allowedTo('admin','company','user'),
    removeSpecificCartProduct);

module.exports = router;
