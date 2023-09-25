const express = require("express");

const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../services/categoryService");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utilities/validators/categoryValidator");

const authService = require("../services/authService");

const subCategoryRoute = require("./subCategoryRoute");
const productRoute = require("./productRoute");

const router = express.Router();

//Nested route to get sub categories
router.use("/:categoryId/subCategories", subCategoryRoute);
router.use("/:categoryId/products", productRoute);

//router.get('/', getCategories);
router
  .route("/")
  .get(getCategories)
  .post(
 
    authService.protect,
    authService.allowedTo("admin"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );

// //without validation
// router.route('/:id')
// .get(getCategory)
// .put(updateCategory)
// .delete(deleteCategory);
//with validation
router
  .route("/:id")
  // param 1 rule, param 2 middleware ,param 3 service
  .get(getCategoryValidator, getCategory)
  .put(
    authService.protect,
    authService.allowedTo("admin"),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
