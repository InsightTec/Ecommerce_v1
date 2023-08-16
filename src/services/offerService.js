const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const asyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

const Offer = require("../models/offerModel");
const OfferVisit = require("../models/offerVisitModel");
const { isTimeDifferenceGreaterThanOneHour } = require("../utilities/visits/recordVisits");

// Upload single image
// image is the name of the field by request sended from client
exports.uploadOfferImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `offer-${uuidv4()}-${Date.now()}.jpeg`;

  // here sometimes we must create the floder upload/categories manually
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`src/uploads/offers/${filename}`);

    // Save image into our db
    req.body.image = filename;
  }

  next();
});

exports.createFilterObj = (req, res, next) => {
  // if nested route
 
  let filterObject = {};
  if (req.params.companyId) filterObject = { company: req.params.companyId };
  // add new value to req
  req.filterObj = filterObject;
  next();
};


// @des get all offers
// @route  GET api/v1/offers
// @access public
exports.getOffers = factory.getAll(Offer);


// @des get  offer by id
// @route  GET api/v1/offers/:id
// @access public
exports.getOffer =  asyncHandler(async (req, res, next) => {
  try{

  

  const { id } = req.params;
  // 1) Build query here not use await to build
  let query = Offer.findById(id);
  // if (populationOpt) {
  //   query = query.populate(populationOpt);
  // }

  // 2) Execute query , here use await for execute
  let offer = await query;

  if (!offer) {
    return next(new ApiError(`No offer for this id ${id}`, 404));
  }

  // update offer visit
  if(req?.user?._id){
    // here return true if last visit more than 1 hour elsse not new vist
    const isNewView=await  this.recordOfferVistit(id,req?.user?._id)
 
    if(isNewView){
      offer.totalViews +=1;
      offer=   await offer.save()
    }
  }


  res.status(200).json({ data: offer });
}
catch(error){
 
}
});


// @des create new offer
// @route  POST api/v1/offers
// @access private
exports.createOffer = factory.createOne(Offer);


// @des post  update offer
// @route  POST api/v1/offers/:id
// @access private
exports.updateOffer = factory.updateOne(Offer);


// @des delete  delete offer
// @route  DELETE api/v1/offers/:id
// @access private
exports.deleteOffer = factory.deleteOne(Offer);




exports.recordOfferVistit =  async( offerId, userId)=> {

  try{
 // Check if a visit already exists for this user and offer combination
 let visit = await OfferVisit.findOne({ offerId, userId });

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
   visit = new OfferVisit({ offerId, userId });

 }

 // Save the visit record
 await visit.save();

 return true;
  }
  catch(error){
return false
  }

}