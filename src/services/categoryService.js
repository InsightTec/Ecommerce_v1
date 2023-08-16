const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const asyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

const CategoryModel = require("../models/categoryModel");

// // 1 - disk Storage
// const multerStorage = multer.diskStorage({
//   // cb is callback function
//   destination: function (req, file, cb) {
//     // null means no errors
//     cb(null, "uploads/categories");
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split("/")[1];
//     const fileName = `category-${uuidv4()}-${Date.now()}.${ext}`;

//     cb(null, fileName);
//   },
// });

// // check image type is image/*
// const multerFilter = function (req, file, cb) {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new ApiError("only image allowed", 400), false);
//   }
// };

// Upload single image
// image is the name of the field by request sended from client
exports.uploadCategoryImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  // here sometimes we must create the floder upload/categories manually
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`src/uploads/categories/${filename}`);

    // Save image into our db
    req.body.image = filename;
  }

  next();
});

// @des get all categories
// @route  GET api/v1/categories
// @access public
exports.getCategories = factory.getAll(CategoryModel);
// exports.getCategories = asyncHandler(async (req, res) => {
//   // get total number of brands
//   const documentsCounts = await CategoryModel.countDocuments();

//   //Build query
//   const apiFeatures = new ApiFeatures(CategoryModel.find(), req.query)
//     .paginate(documentsCounts)
//     .filter()
//     .search()
//     .limitFields()
//     .sort();

//   //execute query
//   const { mongooseQuery, paginationResult } = apiFeatures;
//   // const products = await apiFeatures.mongooseQuery;

//   const categories = await mongooseQuery;

//   res
//     .status(200)
//     .json({ results: categories.length, paginationResult, data: categories });
// });

// @des get  category by id
// @route  GET api/v1/categories/:id
// @access public
exports.getCategory = factory.getOne(CategoryModel);
// exports.getCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params; //or const {id}=req.params;
//   const category = await CategoryModel.findById(id);
//   if (!category) {
//     // res.status(404).json({message:`No category for this id :${id}`});
//     return next(new apiError(`No category for this id :${id}`, 404));
//   }

//   res.status(200).json({ data: category });
// });

// @des create new category
// @route  POST api/v1/categories
// @access private
exports.createCategory = factory.createOne(CategoryModel);
// exports.createCategory = asyncHandler(async (req, res) => {
//   const name = req.body.name;
//   const category = await CategoryModel.create({ name, slug: slugify(name) });
//   res.status(201).send(category);
// });

// @des post  update category
// @route  POST api/v1/categories/:id
// @access private
exports.updateCategory = factory.updateOne(CategoryModel);
// exports.updateCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const { name } = req.body;

//   const category = await CategoryModel.findOneAndUpdate(
//     { _id: id },
//     { name: name, slug: slugify(name) },
//     { new: true }
//   ); // new to return category after update);
//   if (!category) {
//     //res.status(404).json({message:`No category for this id :${id}`});
//     return next(new apiError(`No category for this id :${id}`, 404));
//   }

//   res.status(200).json({ data: category });
// });

// @des delete  delete category
// @route  DELETE api/v1/categories/:id
// @access private
exports.deleteCategory = factory.deleteOne(CategoryModel);
// exports.deleteCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   const category = await CategoryModel.findByIdAndDelete(id);
//   if (!category) {
//     // res.status(404).json({message:`No category for this id :${id}`});
//     return next(new apiError(`No category for this id :${id}`, 404));
//   }

//   res.status(204).send();
// });
