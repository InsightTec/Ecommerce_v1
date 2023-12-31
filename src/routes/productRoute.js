const express = require("express");

const {
  createFilterObj,
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
  deleteProductCoverImage,
  deleteProductGalleryImages,
  getProductsTopFromEachCompany,
  getProductsByCompanyAndCategory
} = require("../services/productService");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utilities/validators/productValidator");

const authService = require("../services/authService");
const reviewsRoute = require("./reviewRoute");

// we use { mergeParams: true } to allow us access parameters sended from parent router  categoryRoute
const router = express.Router({ mergeParams: true });


// Nested route from specific product to reviews
// POST create   /products/:productID/reviews
// GET allReviews   /products/:productID/reviews
// GET getSpecificReview    /products/:productID/reviews/:reviewId
router.use("/:productId/reviews", reviewsRoute);





router
  .route("/")
  .get(createFilterObj, getProducts)
  .post(
    authService.protect,
    authService.allowedTo("admin", "company"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );

//with validation
router
  .route("/:id")
  // param 1 rule, param 2 middleware ,param 3 service
  .get(
    // authService.protect,
    // authService.allowedTo("admin", "company","user"),
    getProductValidator,
     getProduct)

  .put(
    authService.protect,
    authService.allowedTo("admin", "company"),
     uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin","company"),
    deleteProductValidator,
    deleteProduct
  );

  router
  .route("/:id/removeimage")
  .delete(
    authService.protect,
    authService.allowedTo("company","admin"),
    deleteProductCoverImage)

    router
    .route("/:id/removegalleryimages")
    .delete(
      authService.protect,
      authService.allowedTo("company","admin"),
      deleteProductGalleryImages)

      
    router
    .route("/top/:count")
    .get(
      // authService.protect,
      // authService.allowedTo("company","admin","user"),
      getProductsTopFromEachCompany)

      router.route("/company/:companyId/category/:categoryId")
  .get(
    // authService.protect,
    // authService.allowedTo("admin", "company","user"),
   // getProductValidator,
     getProductsByCompanyAndCategory)

      
module.exports = router;
