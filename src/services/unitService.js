const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

const Unit = require("../models/unitModel");

// @des get all Units
// @route  GET api/v1/units
// @access public
exports.getUnits = factory.getAll(Unit);


// @des get  Unit by id
// @route  GET api/v1/units/:id
// @access public
exports.getUnit = factory.getOne(Unit);


// @des create new Unit
// @route  POST api/v1/units
// @access private
exports.createUnit = factory.createOne(Unit);


// @des post  update Unit
// @route  POST api/v1/units/:id
// @access private
exports.updateUnit = factory.updateOne(Unit);


// @des delete  delete Unit
// @route  DELETE api/v1/units/:id
// @access private
exports.deleteUnit = factory.deleteOne(Unit);

