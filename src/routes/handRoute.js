const express = require("express");

// we use { mergeParams: true } to allow us access parameters sended from parent router  governorateRoute
const router = express.Router({ mergeParams: true });


const {
  getHands,
  createHand,
  getHand,
  updateHand,
  deleteHand,
  createFilterObj
} = require("../services/handService");

const {
  getHandValidator,
  createHandValidator,
  updateHandValidator,
  deleteHandValidator,
} = require("../utilities/validators/handValidator");

const authService = require("../services/authService");

router
  .route("/")
  .get(
    authService.protect,
    authService.allowedTo("admin","user"),
    createFilterObj,getHands)
  .post(
    authService.protect,
    authService.allowedTo("admin","user"),
   createHandValidator,
   createHand
  );


router
  .route("/:id")
  // param 1 rule, param 2 middleware ,param 3 service
  .get(
    authService.protect,
    authService.allowedTo("admin","user"),
    getHandValidator,
     getHand)
  .put(
    authService.protect,
    authService.allowedTo("admin","user"),
    updateHandValidator,
    updateHand
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin","user"),
    deleteHandValidator,
    deleteHand
  );

module.exports = router;
