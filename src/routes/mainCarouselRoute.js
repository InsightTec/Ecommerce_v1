const express = require("express");

const {
  getMainCarousels,
  createMainCarousel,
  getMainCarousel,
  updateMainCarousel,
  deleteMainCarousel,
  uploadMainCarouselImage,
  resizeImage,
} = require("../services/mainCarouselService");



const authService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(getMainCarousels)
  .post(
    // authService.protect,
    // authService.allowedTo("admin", "company","user"),
    uploadMainCarouselImage,
    resizeImage,
  createMainCarousel
  );

router
  .route("/:id")
  // param 1 rule, param 2 middleware ,param 3 service
  .get( getMainCarousel)
  .put(
    authService.protect,
    authService.allowedTo("admin", "company","user"),
    uploadMainCarouselImage,
    resizeImage,
    updateMainCarousel
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin","company","user"),
    deleteMainCarousel
  );

module.exports = router;
