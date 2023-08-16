const express = require("express");

const authService = require("../services/authService");

const {
  addCompanyToBookmark,
  removeCompanyFromBookmark,
  getLoggedUserBookmark
} = require("../services/bookmarkService");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user","admin"));

router.route("/").post(addCompanyToBookmark).get(getLoggedUserBookmark);

router.delete("/:companyId", removeCompanyFromBookmark);

module.exports = router;
