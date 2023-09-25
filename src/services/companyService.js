const mongoose = require("mongoose");
const fs = require("fs");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utilities/apiError");
const factory = require("./handlersFactory");


const Company = require("../models/companyModel");
const CompanyVisit = require("../models/companyVisitModel");


const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const { deleteSingleImage } = require("../middlewares/deleteImageMiddleware");
const ApiFeatures = require("../utilities/apiFeatures");
const { isTimeDifferenceGreaterThanOneHour } = require("../utilities/visits/recordVisits");


exports.uploadCompanyImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `company-${uuidv4()}-${Date.now()}.jpeg`;
  
    // here sometimes we must create the floder upload/companies manually
    if (req.file) {
      await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`src/uploads/companies/${filename}`);
  
      // Save image into our db
      req.body.image = filename;
    }
  
    next();
  });
  
// @des get all companies
// @route  GET api/v1/companies
// @access private
exports.getCompanies = asyncHandler(async (req, res) => {
  // for nested routes in subCategories
  let filter = {};
  if (req.filterObj) {
    filter = req.filterObj;
  }

// check if user logged
//   if(req?.user?.role){
//     if(req?.user?.role ==='user'){
//     //  filter.active =true
//      filter.deletedAt =  { $in: [null, undefined] }
//  //  filter.deletedAt =   { $ne: null }
//     }
//   }
//   // for not logged users 
//   else{
//    // filter.active =true
//     filter.deletedAt =  { $in: [null, undefined] }
//   }
  const sccountRole=req?.user?.role;

  // get total number of brands
  const documentsCounts = await Company.countDocuments();

  //Build query
  const apiFeatures = new ApiFeatures(Company.find(filter), req.query)
  .active(sccountRole)
  .delete(sccountRole)
    .paginate(documentsCounts)
    .filter()
    .search('Company')
    .limitFields()
    .sort();

  //execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  // const products = await apiFeatures.mongooseQuery;

  const documents = await mongooseQuery;

  res
    .status(200)
    .json({ results: documents.length, paginationResult, data: documents });
});


// @des get  Company by id
// @route  GET api/v1/companies/:id
// @access public
exports.getCompany =  asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // 1) Build query here not use await to build
  let query = Company.findById(id);
  // if (populationOpt) {
  //   query = query.populate(populationOpt);
  // }

  // 2) Execute query , here use await for execute
  let company = await query;

  if (!company) {
    return next(new ApiError(`No company for this id ${id}`, 404));
  }

  // update company visit
  if(req?.user?._id){
    console.log('1')
    // here return true if last visit more than 1 hour elsse not new vist
    const isNewView=await  this.recordCompanyVistit(id,req?.user?._id)
    console.log('isNewView',isNewView)
    if(isNewView){
      company.totalViews +=1;
      company=   await company.save()
    }
  }
  

  res.status(200).json({ data: company });
});


// @des get  Company by qr
// @route  GET api/v1/companies/:qr/qr
// @access public
exports.getCompanyByQR =  asyncHandler(async (req, res, next) => {
  const { qr } = req.params;
  // 1) Build query here not use await to build
  let query = Company.findOne({QRCode:qr});


  // 2) Execute query , here use await for execute
  const company = await query;

  console.log('company',company)
  if (!company) {
    return next(new ApiError(`No Store for this qr ${qr}`, 404));
  }
  res.status(200).json({ data: company });
});

// @des create new Company
// @route  POST api/v1/companies
// @access private
exports.createCompany =  asyncHandler(async (req, res) => {

  const document = await Company.create(req.body);

  res.status(201).send(document);

});

// @des post  update Company
// @route  POST api/v1/companies/:id
// @access private
exports.updateCompany =   asyncHandler(async (req, res, next) => {
  const { id } = req.params;


//**** */ Start  delete old image if new one sended
  // check if new image cover uploaded 
  if(req.body.image){

      //1.  find the current company document
        const res = await Company.findById(id)
        //console.log('4',res)
        if (!res) {
          return next(new ApiError(`No result for this Company`, 404));
        }

       // 2. check if has old image to delete it
      if(res?.image){
        const result=deleteSingleImage(res?.image,'companies')
      
      }
  }
  //**** */ End  delete old image if new one sended

 

  const document = await Company.findByIdAndUpdate(id, req.body, {
    new: true,
  }); // new to return brand after update);

  if (!document) {
    return next(new ApiError(`No result for this Company`, 404));
  }
  // Trigger "save" event when update document to calcutate ratingsAverage
  document.save();

  res.status(200).json({ data: document });
});






// @des delete  delete company
// @route  DELETE api/v1/companies/:id
// @access private
exports.deleteCompany = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
 // check if new image cover uploaded 

  //1.  find the current company document
    const result = await Company.findById(id)
    //console.log('4',res)
    if (!result) {
      return next(new ApiError(`No result for this Company`, 404));
    }

   // 2. check if has old image to delete it
  if(result?.image){
    const res=deleteSingleImage(result?.image,'companies')
  
  }

//**** */ End  delete old image if new one sended
  const document = await Company.findByIdAndDelete(id);
  if (!document) {
    // res.status(404).json({message:`No brand for this id :${id}`});
    return next(new ApiError(`No brand for this id :${id}`, 404));
  }
  // Trigger "remove" event when update document
  document.remove();

  res.status(204).send();
});

// @des delete  Company by imageName
// @route  GET api/v1/companies/:id/removeimage
// @access private
exports.deleteCompanyCoverImage =  asyncHandler(async (req, res, next) => {
  const { id } = req.params;
 


  const document = await Company.findById(id)
  
  if (!document) {

    return next(new ApiError(`No Cover Image for this id :${id}`, 404));
  }

  let result=false

if(document?.image){
  // actual delete image from uploads folder
   result=deleteSingleImage(document?.image,'companies')

  // lgical delete image from db
  document.image=''
  const updatedDocument= await document.save(); 





    if (!result) {
     return next(new ApiError(`Delete image Error`, 404));
  }
}


  res.status(200).json({ result: result });
});


// Image processing
exports.deleteOldCompanyCoverImage = asyncHandler(async (req, res, next) => {

  const {id}=req.params
  const document = await Company.findById(id)
  
if(document?.image){
  const result=deleteSingleImage(document?.image,'companies')
}

  next();
});


exports.recordCompanyVistit =  async( companyId, userId)=> {

  try{
 // Check if a visit already exists for this user and company combination
 let visit = await CompanyVisit.findOne({ companyId, userId });
console.log('visit',visit)
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
   visit = new CompanyVisit({ companyId, userId });

 }

 // Save the visit record
 await visit.save();

 return true;
  }
  catch(error){
return false
  }

}