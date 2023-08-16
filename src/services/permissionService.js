
const factory = require("./handlersFactory");


const Permission = require("../models/permissionModel");


// @des get all permissions
// @route  GET api/v1/permissions
// @access private
exports.getPermissions = factory.getAll(Permission);


// @des get permission by id
// @route  GET api/v1/permissions/:id
// @access public
exports.getPermission = factory.getOne(Permission);

// @des create new permission
// @route  POST api/v1/permissions
// @access private
exports.createPermission = factory.createOne(Permission);

// @des post  update permission
// @route  POST api/v1/permissions/:id
// @access private
exports.updatePermission = factory.updateOne(Permission);


// @des delete  permission
// @route  DELETE api/v1/permissions/:id
// @access private
exports.deletePermission = factory.deleteOne(Permission);
