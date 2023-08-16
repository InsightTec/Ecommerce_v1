const express = require("express");

const {
  createFilterObj,
  getOffers,
  createOffer,
  getOffer,
  updateOffer,
  deleteOffer,
  uploadOfferImage,
  resizeImage,
} = require("../services/offerService");
const {
  getOfferValidator,
  createOfferValidator,
  updateOfferValidator,
  deleteOfferValidator,
} = require("../utilities/validators/offerValidator");

const authService = require("../services/authService");


// we use { mergeParams: true } to allow us access parameters sended from parent router  companyRoute
const router = express.Router({ mergeParams: true });



//router.get('/', getCategories);
router
  .route("/")
  .get(createFilterObj,getOffers)
  .post(
 
    authService.protect,
    authService.allowedTo("admin", "manager","user"),
    uploadOfferImage,
    resizeImage,
    createOfferValidator,
    createOffer
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
  .get(
    authService.protect,
    authService.allowedTo("admin", "manager","user"),
    getOfferValidator,
     getOffer)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager","user"),
    uploadOfferImage,
    resizeImage,
    updateOfferValidator,
    updateOffer
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin", "manager","user"),
    deleteOfferValidator,
    deleteOffer
  );

module.exports = router;
