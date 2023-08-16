const asyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

const Tag = require("../models/tagModel");

// @des get all tags
// @route  GET api/v1/tags
// @access public
exports.getTags = factory.getAll(Tag);


// @des get  tag by id
// @route  GET api/v1/tags/:id
// @access public
exports.getTag = factory.getOne(Tag);


// @des create new Tag
// @route  POST api/v1/tags
// @access private
exports.createTag = factory.createOne(Tag);
 
// @des post  update Tag
// @route  POST api/v1/tags/:id
// @access private
exports.updateTag = factory.updateOne(Tag);

// @des delete  delete Tag
// @route  DELETE api/v1/tags/:id
// @access private
exports.deleteTag = factory.deleteOne(Tag);

