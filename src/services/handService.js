const asyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");


const Hand = require("../models/handModel");


exports.createFilterObj = (req, res, next) => {
    // if nested route
    let filterObject = {};
    if (req.params.regionId) filterObject = { region: req.params.regionId };
    // add new value to req
    req.filterObj = filterObject;
    next();
  };

// @des get all hands
// @route  GET api/v1/hands
// @access private
exports.getHands = factory.getAll(Hand);


// @des get  hand by id
// @route  GET api/v1/hands/:id
// @access public
exports.getHand = factory.getOne(Hand);

// @des create new hand
// @route  POST api/v1/hands
// @access private
exports.createHand = factory.createOne(Hand);

// @des post  update hand
// @route  POST api/v1/hands/:id
// @access private
exports.updateHand = factory.updateOne(Hand);


// @des delete  delete hand
// @route  DELETE api/v1/hands/:id
// @access private
exports.deleteHand = factory.deleteOne(Hand);
