const express = require("express");

const {
  getTags,
  createTag,
  getTag,
  updateTag,
  deleteTag,

} = require("../services/tagService");

const {
  getTagValidator,
  createTagValidator,
  updateTagValidator,
  deleteTagValidator,
} = require("../utilities/validators/tagValidator");

const authService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(getTags)
  .post(
    authService.protect,
    authService.allowedTo("admin", "user"),
    createTagValidator,
    createTag
  );


router
  .route("/:id")
  // param 1 rule, param 2 middleware ,param 3 service
  .get(getTagValidator, getTag)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    
    updateTagValidator,
    updateTag
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin","user"),
    deleteTagValidator,
    deleteTag
  );

module.exports = router;
