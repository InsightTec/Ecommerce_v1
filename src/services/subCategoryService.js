const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const subCategoryModel = require("../models/subCategoryModel");
const apiError = require("../utilities/apiError");
const ApiFeatures = require("../utilities/apiFeatures");
const factory = require("./handlersFactory");

exports.setCategoryIdToBody = (req, res, next) => {
  // nested rout from category to sub , if category not send in bode take it from param
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// @des create new subcategory
// @route  POST api/v1/subcategories
// @access private
exports.createSubCategory = factory.createOne(subCategoryModel);

exports.createFilterObj = (req, res, next) => {
  // if nested route
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  // add new value to req
  req.filterObj = filterObject;
  next();
};
// @des get all subCategories
// @route  GET api/v1/subcategories
// @access public
exports.getSubCategories = factory.getAll(subCategoryModel);


// @des get  category by id
// @route  GET api/v1/categories/:id
// @access public
exports.getSubCategory = factory.getOne(subCategoryModel);


// @des post  update category
// @route  POST api/v1/categories/:id
// @access private
exports.updateSubCategory = factory.updateOne(subCategoryModel);


// @des delete  delete sub category
// @route  DELETE api/v1/subcategories/:id
// @access private
exports.deleteSubCategory = factory.deleteOne(subCategoryModel);

