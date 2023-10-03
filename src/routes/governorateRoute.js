const express = require("express");

// we use { mergeParams: true } to allow us access parameters sended from parent router  
const router = express.Router({ mergeParams: true });


const {
  getGovernorations,
  createGovernorate,
  getGovernorate,
  updateGovernorate,
  deleteGovernorate,
  createFilterObj
} = require("../services/governorateService");

const {
  getGovernorateValidator,
  createGovernorateValidator,
  updateGovernorateValidator,
  deleteGovernorateValidator,
} = require("../utilities/validators/governorateValidator");

const authService = require("../services/authService");

const regionRoute = require("./regionRoute");
//Nested route to get regions
router.use("/:governorateId/regions", regionRoute);



router
  .route("/")
  .get(
    authService.protect,
    authService.allowedTo("admin","company","user"),
    createFilterObj,getGovernorations)
  .post(
    authService.protect,
    authService.allowedTo("admin","company","user"),
   createGovernorateValidator,
   createGovernorate
  );


router
  .route("/:id")
  // param 1 rule, param 2 middleware ,param 3 service
  .get(
    authService.protect,
    authService.allowedTo("admin","company","user"),
    getGovernorateValidator,
     getGovernorate)
  .put(
    authService.protect,
    authService.allowedTo("admin","company","user"),
    updateGovernorateValidator,
    updateGovernorate
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin","company","user"),
    deleteGovernorateValidator,
    deleteGovernorate
  );

module.exports = router;
