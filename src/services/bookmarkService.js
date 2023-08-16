const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

// @desc    Add company to wishlist
// @route   POST /api/v1/bookmark
// @access  Protected/User
exports.addCompanyToBookmark = asyncHandler(async (req, res, next) => {
  // $addToSet => add companyId to bookmark array if companyId not exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { bookmark: req.body.companyId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Store added successfully to your bookmark.",
    data: user.bookmark,
  });
});

// @desc    Remove company from bookmark
// @route   DELETE /api/v1/bookmark/:companyId
// @access  Protected/User
exports.removeCompanyFromBookmark = asyncHandler(async (req, res, next) => {
  // $pull => remove companyId from wishlist array if companyId exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { bookmark: req.params.companyId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Store removed successfully from your bookmark.",
    data: user.bookmark,
  });
});

// @desc    Get logged user bookmark
// @route   GET /api/v1/bookmark
// @access  Protected/User
exports.getLoggedUserBookmark = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("bookmark");

  res.status(200).json({
    status: "success",
    results: user.bookmark.length,
    data: user.bookmark,
  });
});
