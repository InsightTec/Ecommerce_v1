const express = require("express");

// we use { mergeParams: true } to allow us access parameters sended from parent router  governorateRoute
const router = express.Router({ mergeParams: true });


const {
  getRegions,
  createRegion,
  getRegion,
  updateRegion,
  deleteRegion,
  createFilterObj
} = require("../services/regionService");

const {
  getRegionValidator,
  createRegionValidator,
  updateRegionValidator,
  deleteRegionValidator,
} = require("../utilities/validators/regionValidator");

const authService = require("../services/authService");

const handRoute = require("./handRoute");
//Nested route to get hands
router.use("/:regionId/hands", handRoute);


router
  .route("/")
  .get(
    authService.protect,
    authService.allowedTo("admin","company","user"),
    createFilterObj,getRegions)
  .post(
    authService.protect,
    authService.allowedTo("admin","company","user"),
   createRegionValidator,
   createRegion
  );


router
  .route("/:id")
  // param 1 rule, param 2 middleware ,param 3 service
  .get(
    authService.protect,
    authService.allowedTo("admin","company","user"),
    getRegionValidator, 
    getRegion)
  .put(
    authService.protect,
    authService.allowedTo("admin","company","user"),
    updateRegionValidator,
    updateRegion
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin","company","user"),
    deleteRegionValidator,
    deleteRegion
  );

module.exports = router;
