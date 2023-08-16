const express = require("express");

const authService = require("../services/authService");

const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
  setAddressAsDefault
} = require("../services/addressService");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user","admin"));

router.route("/").post(addAddress).get(getLoggedUserAddresses);

router.delete("/:addressId", removeAddress);

router.put("/:addressId/default", setAddressAsDefault);

module.exports = router;
