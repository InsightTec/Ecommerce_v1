const express = require("express");

const router = express.Router();

const {
  getCountries,
  createCountry,
  getCountry,
  updateCountry,
  deleteCountry,
} = require("../services/countryService");

const {
  getCountryValidator,
  createCountryValidator,
  updateCountryValidator,
  deleteCountryValidator,
} = require("../utilities/validators/countryValidator");

const authService = require("../services/authService");

const governorateRoute = require("./governorateRoute");
//Nested route to get governorations
router.use("/:countryId/governorations", governorateRoute);

router
  .route("/")
  .get(

    getCountries)
  .post(
    authService.protect,
    authService.allowedTo("admin","user"),
   createCountryValidator,
   createCountry

  );


router
  .route("/:id")
  // param 1 rule, param 2 middleware ,param 3 service
  .get(
    authService.protect,
    authService.allowedTo("admin","user"),
    getCountryValidator,
     getCountry)
  .put(
    authService.protect,
    authService.allowedTo("admin","user"),
    updateCountryValidator,
    updateCountry
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin","user"),
    deleteCountryValidator,
    deleteCountry
  );

module.exports = router;
