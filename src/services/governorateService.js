const asyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");


const Governorate = require("../models/governorateModel");


exports.createFilterObj = (req, res, next) => {
    // if nested route
    let filterObject = {};
    if (req.params.countryId) filterObject = { country: req.params.countryId };
    // add new value to req
    req.filterObj = filterObject;
    next();
  };

// @des get all governorations
// @route  GET api/v1/governorations
// @access private
exports.getGovernorations = factory.getAll(Governorate);


// @des get  governorate by id
// @route  GET api/v1/governorations/:id
// @access public
exports.getGovernorate = factory.getOne(Governorate);

// @des create new governorate
// @route  POST api/v1/governorations
// @access private
exports.createGovernorate = factory.createOne(Governorate);

// @des post  update governorate
// @route  POST api/v1/governorations/:id
// @access private
exports.updateGovernorate = factory.updateOne(Governorate);


// @des delete  delete governorate
// @route  DELETE api/v1/governorations/:id
// @access private
exports.deleteGovernorate = factory.deleteOne(Governorate);
