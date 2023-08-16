const express = require("express");

const {
  getCompanies,
  createCompany,
  getCompany,
  updateCompany,
  deleteCompany,
  getCompanyByQR,
  deleteCompanyCoverImage,
  uploadCompanyImage,
  deleteOldCompanyCoverImage,
  resizeImage,

} = require("../services/companyService");
 
const {
  getCompanyValidator,
  createCompanyValidator,
  updateCompanyValidator,
  deleteCompanyValidator,
} = require("../utilities/validators/companyValidator");

const authService = require("../services/authService");
const productRoute = require("./productRoute");
const offerRoute = require("./offerRoute");

const router = express.Router();

//Nested route to get sub categories
router.use("/:companyId/products", productRoute);
router.use("/:companyId/offers", offerRoute);

router
  .route("/")
  .get(
    // authService.protect,
    // authService.allowedTo("admin", "manager","user"),
 getCompanies)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager","user"),
   
    createCompanyValidator,
    uploadCompanyImage,
    resizeImage,
    createCompany
  );


router
  .route("/:id")
  // param 1 rule, param 2 middleware ,param 3 service
  .get(
    authService.protect,
    authService.allowedTo("company","admin","user"),
    getCompanyValidator,
     getCompany)
  .put(
    authService.protect,
    authService.allowedTo("company","admin","user"),
      
    uploadCompanyImage,
 
    resizeImage, 
 updateCompanyValidator,
    updateCompany
  )
  .delete(
    authService.protect,
    authService.allowedTo("company","admin","user"),
    deleteCompanyValidator,
    deleteCompany

  );

  router
  .route("/:qr/qr")
  // param 1 rule, param 2 middleware ,param 3 service
  .get(
    authService.protect,
    authService.allowedTo("company","admin","user"),
    getCompanyByQR)

    router
    .route("/:id/removeimage")
    .delete(
      authService.protect,
      authService.allowedTo("company","admin","user"),
      deleteCompanyCoverImage)

      

module.exports = router;
