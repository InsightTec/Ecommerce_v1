const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

// @desc    Add address to user addresses list
// @route   POST /api/v1/addresses
// @access  Protected/User
exports.addAddress = asyncHandler(async (req, res, next) => {
  // $addToSet => add address object to user addresses  array if address not exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Address added successfully.",
    data: user.addresses,
  });
});

// @desc    Remove address from user addresses list
// @route   DELETE /api/v1/addresses/:addressId
// @access  Protected/User
exports.removeAddress = asyncHandler(async (req, res, next) => {
  // $pull => remove address object from user addresses array if addressId exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Address removed successfully.",
    data: user.addresses,
  });
});

// @desc    Get logged user addresses list
// @route   GET /api/v1/addresses
// @access  Protected/User
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");

  res.status(200).json({
    status: "success",
    results: user.addresses.length,
    data: user.addresses,
  });
});


// @desc    set address default
// @route   POST /api/v1/addresses/:addressId/default
// @access  Protected/User
exports.setAddressAsDefault = asyncHandler(async (req, res, next) => {
  // $addToSet => add address object to user addresses  array if address not exist

  const {addressId}= req.params

  console.log('addressId',addressId)
  console.log('req.user._id',req.user._id)

  // here find all addresses  with default =true to make it  default =false, in user _id 
   await  User.updateOne(
    {
        _id: req.user._id,
        addresses: {
            $elemMatch: {
                default: true,
            }
        }
    },
    {
        $set:{
            'addresses.$.default': false,
        }
    }, 
    {
        new: true,
        useFinedAndModify: false,
    })
    // here  address  with _id =addressId to make it  default =true , in user _id 
     await  User.updateOne(
      {
          _id: req.user._id,
          addresses: {
              $elemMatch: {
                  _id: addressId,
              }
          }
      },
      {
          $set:{
              'addresses.$.default': true,
          }
      }, 
      {
          new: true,
          useFindAndModify: false,
      })

      const user =await User.findById(req.user._id)

      console.log('user.addresses',user)
  res.status(200).json({
    status: "success",
    message: "Address seted as default successfully.",
    data: user.addresses,
  });
});

