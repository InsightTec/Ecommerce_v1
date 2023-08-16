const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");
const productModel = require("../models/productModel");
const productVisit = require("../models/productVisitModel");

const ApiError = require("../utilities/apiError");
const factory = require("./handlersFactory");
const { deleteSingleImage } = require("../middlewares/deleteImageMiddleware");
const { isTimeDifferenceGreaterThanOneHour } = require("../utilities/visits/recordVisits");

exports.uploadProductImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  console.log('req.body',JSON.stringify(req.body));
  // console.log(req.files);
  //1- Image processing for imageCover
  if (req.files)
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`src/uploads/products/${imageCoverFileName}`);

    // Save image into our db
    req.body.imageCover = imageCoverFileName;
  }
  //2- Image processing for images
 // console.log('req.files.images',req.files.images)
  if (req.files)
  if (req.files.images) {
    req.body.images = [];
    // use promise.all to make map function wait until all operation to be finished
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`src/uploads/products/${imageName}`);

        // Save image into our db
        req.body.images.push(imageName);
      })
    );

    next();
  }
  else 
  next();
});

exports.createFilterObj = (req, res, next) => {
  // if nested route
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  if (req.params.companyId) filterObject = { company: req.params.companyId };
  // add new value to req
  req.filterObj = filterObject;
  next();
};

// @des get all products
// @route  GET api/v1/products
// @access public
exports.getProducts = factory.getAll(productModel, "Products");

// @des get  product by id
// @route  GET api/v1/products/:id
// @access public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // 1) Build query here not use await to build
  let query = productModel.findById(id);
  // if (populationOpt) {
  //   query = query.populate(populationOpt);
  // }

  // 2) Execute query , here use await for execute
  let product = await query;

  if (!product) {
    return next(new ApiError(`No Product for this id ${id}`, 404));
  }

  // update product visit
  if(req?.user?._id){
    console.log('1')
    // here return true if last visit more than 1 hour elsse not new vist
    const isNewView=await  this.recordProductVistit(id,req?.user?._id)
    console.log('isNewView',isNewView)
    if(isNewView){
       product.totalViews +=1;
       product=   await product.save()
    }
  }
   



  res.status(200).json({ data: product });
});

// @des create new product
// @route  POST api/v1/products
// @access private
exports.createProduct = factory.createOne(productModel);


// @des post  update product
// @route  POST api/v1/products/:id
// @access private
exports.updateProduct = factory.updateOne(productModel);


// @des delete  delete product
// @route  DELETE api/v1/products/:id
// @access private
exports.deleteProduct = factory.deleteOne(productModel);


// @des delete  Product cover image
// @route  GET api/v1/products/:id/removeimage
// @access private
exports.deleteProductCoverImage =  asyncHandler(async (req, res, next) => {
  const { id } = req.params;
 
console.log('id',id)

  const document = await productModel.findById(id)
  console.log('document',document)
  if (!document) {

    return next(new ApiError(`No Cover Image for this id :${id}`, 404));
  }

  let result=false

if(document?.imageCover){
  // actual delete image from uploads folder
  console.log('document?.imageCover',document?.imageCover)
   result=deleteSingleImage(document?.imageCover,'products')

  // lgical delete image from db
  document.imageCover=''
  const updatedDocument= await document.save(); 





    if (!result) {
     return next(new ApiError(`Delete image Error`, 404));
  }
}


  res.status(200).json({ result: result });
});



// @des delete  Product Gallery images
// @route  GET api/v1/products/:id/removegalleryimages
// @access private
exports.deleteProductGalleryImages =  asyncHandler(async (req, res, next) => {
  const { id } = req.params;
 
console.log('id',id)

  const document = await productModel.findById(id)
  console.log('document',document)
  if (!document) {

    return next(new ApiError(`No Gallery images  for this id :${id}`, 404));
  }

  let result=false

if(document?.images){
  // actual delete image from uploads folder
  document?.images?.forEach((image)=>{
    console.log('image',image)
    result=deleteSingleImage(image,'products')
  })


  // lgical delete gallery images from db
  document.images=[]
  const updatedDocument= await document.save(); 





    if (!result) {
     return next(new ApiError(`Delete image Error`, 404));
  }
}


  res.status(200).json({ result: result });
});



// @des get  top Product from companies
// @route  GET api/v1/products/top/:count
// @access private
exports.getProductsTopFromEachCompany =  asyncHandler(async (req, res, next) => {
  const { count } = req.params;
  try {

    const pipeline = [
      {
        $match: {
          company: { $ne: null },
        },
      },
      // {
      //   $group: {
      //     _id: '$company',
      //     products: { $push: '$_id' },
      //   },
      // },
      // {
      //   $sort: {
      //     products: { $meta: 'rank', $desc: true },
      //   },
      // },
      // {
      //   $limit: 2,
      // },
    ];

    const documents = await productModel.aggregate(pipeline);
    res.status(200).json({ results: documents.length, paginationResult:{}, data: documents });
    
  } catch (error) {
    console.error('Error retrieving top 2 products per company:', error);
    return next(new ApiError(`Error retrieving top 2 products per company`, 404));
  }

  



});

exports.recordProductVistit =  async( productId, userId)=> {

  try{
 // Check if a visit already exists for this user and product combination
 let visit = await productVisit.findOne({ productId, userId });

 if (visit) {
   // If a visit exists, update the visit date and increment the number of visits
   const currentTime = new Date();
   const lastVisitTime = visit.visitDate;
   if (!isTimeDifferenceGreaterThanOneHour(currentTime, lastVisitTime)) {
    return false;
  }

   visit.visitDate = currentTime ;
   visit.numVisits += 1;
 } else {
   // If no visit exists, create a new visit record
   visit = new productVisit({ productId, userId });

 }

 // Save the visit record
 await visit.save();

 return true;
  }
  catch(error){
return false
  }

}
