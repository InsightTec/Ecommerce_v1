const asyncHandler = require('express-async-handler');
const ApiError = require('../utilities/apiError');

const Product = require('../models/productModel');
const Coupon = require('../models/couponModel');
const Cart = require('../models/cartModel');

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

// @desc    Add product to  cart
// @route   POST /api/v1/cart
// @access  Private/User
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color,quantity } = req.body;
  const product = await Product.findById(productId);

  // 1) Get Cart for logged user
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // create cart fot logged user with product
  
    cart = await Cart.create({
      user: req.user._id,
      company:product?.company?._id,
      currency:product?.currency,
      cartItems: [{ product: productId, color,quantity, price: product.price,currency:product.currency }],
    });
  } 
  else {

    if(cart.cartItems.length === 0){
      cart.company=product?.company?._id;
      cart.currency=product?.currency;
    }
 

    // product exist in cart, update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );

    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;

      cart.cartItems[productIndex] = cartItem;
    } else {
      // product not exist in cart,  push product to cartItems array
      cart.cartItems.push({ product: productId, color, price: product.price ,currency:product.currency});
    }
  }

  // Calculate total cart price
  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Product added to cart successfully',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Add product to  cart
// @route   POST /api/v1/cart/guest/:id
// @access  public
exports.addProductToCartByQuestId = asyncHandler(async (req, res, next) => {

  const {id}=req.params;
  const { productId, color,quantity } = req.body;
  const product = await Product.findById(productId);

  // 1) Get Cart for logged user
  let cart = await Cart.findOne({ guest: id });

  if (!cart) {
    // create cart fot logged user with product
   
    cart = await Cart.create({
      guest:id,
      company:product?.company?._id,
      currency:product?.currency,
      cartItems: [{ product: productId, color,quantity, price: product.price,currency:product.currency }],
    });
  } 
  else {

    if(cart.cartItems.length === 0){
      cart.company=product?.company?._id;
      cart.currency=product?.currency;
    }
  

    // product exist in cart, update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );

    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;

      cart.cartItems[productIndex] = cartItem;
    } else {
      // product not exist in cart,  push product to cartItems array
      cart.cartItems.push({ product: productId, color, price: product.price ,currency:product.currency});
    }
  }

  // Calculate total cart price
  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Product added to cart successfully',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Add product to  cart
// @route   POST /api/v1/cart/:id
// @access  Public
exports.addProductToCartWithoutLogin = asyncHandler(async (req, res, next) => {
  
   const {id}=req.params;
  const { productId, color,quantity } = req.body;

  const product = await Product.findById(productId);

 

  // 1) Get Cart by id
  // let cart;
  // if(id !='new')
  //    cart = await Cart.findById(id);

  const  cart = await Cart.find({guest:id});

  if (!cart) {
    // create cart fot logged user with product
  
    cart = await Cart.create({
     // user: req.user._id,
    // ...(req?.user?._id ? { user:  req.user._id } : {}),
      company:product?.company?._id,
      currency:product?.currency,
      cartItems: [{ product: productId, color,quantity, price: product.price,currency:product.currency }],
    });
  } 
  else {

    if(cart.cartItems.length === 0){
      cart.company=product?.company?._id;
      cart.currency=product?.currency;
    }
   

    // product exist in cart, update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );

    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;

      cart.cartItems[productIndex] = cartItem;
    } else {
      // product not exist in cart,  push product to cartItems array
      cart.cartItems.push({ product: productId, color, price: product.price ,currency:product.currency});
    }
  }

  // Calculate total cart price
  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Product added to cart successfully',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Get logged user cart
// @route   GET /api/v1/cart
// @access  Private/User
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  
  const cart = await Cart.findOne({ user: req.user._id })
  .populate([
     {path: 'cartItems.product'},
  //     {path: 'cartItems.product', populate: [
  //             { path: 'category',select: 'name',model:'Category' },
  //           ]},
  //     {path: 'cartItems.product', populate: [
  //             { path: 'company',select: 'name'},
  //     ]},
    ]);

    
  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user id : ${req.user._id}`, 404)
    );

  return   res.status(200).json({
      status: 'success',
      numOfCartItems: 0,
      _id:'',
      data: {cartItems:[]},
    });
  }

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Get  cart by Id
// @route   GET /api/v1/cart/:id
// @access  public
exports.getCartById = asyncHandler(async (req, res, next) => {


  const {id}=req.params
  const cart = await Cart.findById(id)
  .populate([
     {path: 'cartItems.product'},
  //     {path: 'cartItems.product', populate: [
  //             { path: 'category',select: 'name',model:'Category' },
  //           ]},
  //     {path: 'cartItems.product', populate: [
  //             { path: 'company',select: 'name'},
  //     ]},
    ]);

    
  if (!cart) {
    // return next(
    //   new ApiError(`There is no cart for this user id : ${req.user._id}`, 404)
    // );

  return   res.status(200).json({
      status: 'success',
      numOfCartItems: 0,
      _id:'',
      data: {cartItems:[]},
    });
  }

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});


// @desc    Get  cart by guest Id
// @route   GET /api/v1/cart/guest/:id
// @access  public
exports.getCartByGuestId = asyncHandler(async (req, res, next) => {
 
 
  const {id}=req.params


  const cart = await Cart.findOne({guest:id})
  .populate([
     {path: 'cartItems.product'},
  //     {path: 'cartItems.product', populate: [
  //             { path: 'category',select: 'name',model:'Category' },
  //           ]},
  //     {path: 'cartItems.product', populate: [
  //             { path: 'company',select: 'name'},
  //     ]},
    ]);

    
  if (!cart || cart=='null') {
    // return next(
    //   new ApiError(`There is no cart for this user id : ${req.user._id}`, 404)
    // );

  return   res.status(200).json({
      status: 'success',
      numOfCartItems: 0,
      _id:'',
      data: {cartItems:[]},
    });
  }

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// here to remove by item id for cart screen
// @desc    Remove specific cart item
// @route   DELETE /api/v1/cart/:itemId
// @access  Private/User
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );

 const r= calcTotalCartPrice(cart);

 if(cart.cartItems.length === 0){
  cart.company=null
  cart.currency=null
 }
 

  cart.save();


  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// here to remove by item id for cart screen by cart id
// @desc    Remove specific cart item
// @route   DELETE /api/v1/cart/:id/byCart
// @access  public
exports.removeSpecificCartItemByCartId = asyncHandler(async (req, res, next) => {
  const {id,itemId}=req.params;



  const cart = await Cart.findByIdAndUpdate(
    id,
    {
      $pull: { cartItems: { _id: itemId } },
    },
    { new: true }
  );

 const r= calcTotalCartPrice(cart);

 if(cart.cartItems.length === 0){
  cart.company=null
  cart.currency=null
 }
 

  cart.save();

 

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// here to remove by product id for product screen
// @desc    Remove specific cart product
// @route   DELETE /api/v1/cart/product/:productId
// @access  Private/User
exports.removeSpecificCartProduct = asyncHandler(async (req, res, next) => {

  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { product: req.params.productId } },
    },
    { new: true }
  );

 const r= calcTotalCartPrice(cart);

 if(cart.cartItems.length === 0){
  cart.company=null
    cart.currency=null
 }
    


  cart.save();



  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    clear logged user cart
// @route   DELETE /api/v1/cart
// @access  Private/User
exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

// @desc    Update specific cart item quantity
// @route   PUT /api/v1/cart/:itemId
// @access  Private/User
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ApiError(`there is no cart for user ${req.user._id}`, 404));
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item.product.toString() === req.params.itemId
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(
      new ApiError(`there is no item for this id :${req.params.itemId}`, 404)
    );
  }

  calcTotalCartPrice(cart);

  await cart.save();

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Update specific cart item quantity
// @route   PUT /api/v1/cart/:id/byCart
// @access  public
exports.updateCartItemQuantityById = asyncHandler(async (req, res, next) => {
  const {id}=req.params;
  const { productId,quantity } = req.body;


  const cart = await Cart.findById(id);
  
  if (!cart) {
    return next(new ApiError(`there is no cart for  ${id}`, 404));
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
 
    cartItem.quantity = quantity;
   
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(
      new ApiError(`there is no item for this id :${productId}`, 404)
    );
  }

  calcTotalCartPrice(cart);

  await cart.save();


  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Apply coupon on logged user cart
// @route   PUT /api/v1/cart/applyCoupon
// @access  Private/User
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // 1) Get coupon based on coupon name
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError(`Coupon is invalid or expired`));
  }

  // 2) Get logged user cart to get total cart price
  const cart = await Cart.findOne({ user: req.user._id });

  const totalPrice = cart.totalCartPrice;

  // 3) Calculate price after priceAfterDiscount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2); // 99.23

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
