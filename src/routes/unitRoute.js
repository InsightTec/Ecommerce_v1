const express = require("express");

const {
  getUnits,
  createUnit,
  getUnit,
  updateUnit,
  deleteUnit,
} = require("../services/unitService");
const {
  getUnitValidator,
  createUnitValidator,
  updateUnitValidator,
  deleteUnitValidator,
} = require("../utilities/validators/unitValidator");

const authService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(getUnits)
  .post(
    authService.protect,
    authService.allowedTo("admin", "company","user"),
    createUnitValidator,
    createUnit
  );


router
  .route("/:id")
  // param 1 rule, param 2 middleware ,param 3 service
  .get(getUnitValidator, getUnit)
  .put(
    authService.protect,
    authService.allowedTo("admin", "company","user"),
    updateUnitValidator,
    updateUnit
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin", "company","user"),
    deleteUnitValidator,
    deleteUnit
  );

module.exports = router;
