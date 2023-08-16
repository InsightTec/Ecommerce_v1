const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

const MainCarousel = require("../models/mainCarouselModel");
// Upload single image
// image is the name of the field by request sended from client
exports.uploadMainCarouselImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if(req.file){
        const filename = `mainCarousel-${uuidv4()}-${Date.now()}.jpeg`;

    // here sometimes we must create the floder upload/MainCarousel manually
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`src/uploads/mainCarousel/${filename}`);

    // Save image into our db
    req.body.image = filename;
  }


  next();
});

// @des get all maincarousel
// @route  GET api/v1/maincarousel
// @access public
exports.getMainCarousels = factory.getAll(MainCarousel);


// @des get  maincarousel by id
// @route  GET api/v1/maincarousel/:id
// @access public
exports.getMainCarousel = factory.getOne(MainCarousel);


// @des create new maincarousel
// @route  POST api/v1/maincarousel
// @access private
exports.createMainCarousel = factory.createOne(MainCarousel);


// @des post  update maincarousel
// @route  POST api/v1/maincarousel/:id
// @access private
exports.updateMainCarousel = factory.updateOne(MainCarousel);


// @des delete  delete maincarousel
// @route  DELETE api/v1/maincarousel/:id
// @access private
exports.deleteMainCarousel = factory.deleteOne(MainCarousel);

