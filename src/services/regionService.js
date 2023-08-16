const asyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");


const Region = require("../models/regionModel");

exports.createFilterObj = (req, res, next) => {
    // if nested route
    let filterObject = {};
    if (req.params.governorateId) filterObject = { governorate: req.params.governorateId };
    // add new value to req
    req.filterObj = filterObject;
    next();
  };

// @des get all regions
// @route  GET api/v1/regions
// @access private
exports.getRegions = factory.getAll(Region);


// @des get  region by id
// @route  GET api/v1/regions/:id
// @access public
exports.getRegion = factory.getOne(Region);

// @des create new regions
// @route  POST api/v1/regions
// @access private
exports.createRegion = factory.createOne(Region);

// @des post  update region
// @route  POST api/v1/regions/:id
// @access private
exports.updateRegion = factory.updateOne(Region);


// @des delete  delete region
// @route  DELETE api/v1/regions/:id
// @access private
exports.deleteRegion = factory.deleteOne(Region);
