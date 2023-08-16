const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

const brandModel = require("../models/brandModel");
// Upload single image
// image is the name of the field by request sended from client
exports.uploadBrandImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

  // here sometimes we must create the floder upload/brands manually
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`src/uploads/brands/${filename}`);

  // Save image into our db
  req.body.image = filename;

  next();
});

// @des get all brands
// @route  GET api/v1/brands
// @access public
exports.getBrands = factory.getAll(brandModel);


// @des get  brand by id
// @route  GET api/v1/brands/:id
// @access public
exports.getBrand = factory.getOne(brandModel);


// @des create new brand
// @route  POST api/v1/brands
// @access private
exports.createBrand = factory.createOne(brandModel);


// @des post  update brand
// @route  POST api/v1/brands/:id
// @access private
exports.updateBrand = factory.updateOne(brandModel);


// @des delete  delete brand
// @route  DELETE api/v1/brands/:id
// @access private
exports.deleteBrand = factory.deleteOne(brandModel);

