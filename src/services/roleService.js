const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");
const ApiFeatures = require("../utilities/apiFeatures");
const addActivityLogData=require("../utilities/logger/activityLog");
const Role = require("../models/roleModel");


// @des get all roles
// @route  GET api/v1/roles
// @access private
exports.getRoles =   asyncHandler(async (req, res) => {
    // for nested routes in subCategories
    let filter = {};
    if (req.filterObject) {
      filter = req.filterObject;
    }
  
    
    // get total number of brands
    const documentsCounts = await Role.countDocuments();
  
    //Build query
    const apiFeatures = new ApiFeatures(Role.find(filter).populate([{path: 'permissions'}]), req.query)
      .paginate(documentsCounts)
      .filter()
      
      .limitFields()
      .sort();
  
    //execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    // const products = await apiFeatures.mongooseQuery;
  
    const documents = await mongooseQuery;
  
    // add activity to winston logger
    addActivityLogData(`get all  Filters`,`Total roles retrieved is ${documents.length}`,req);
     
  
    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  })


// @des get  role by id
// @route  GET api/v1/roles/:id
// @access public
exports.getRole = factory.getOne(Role,{path: 'permissions', select: 'name',});

// @des create new role
// @route  POST api/v1/roles
// @access private
exports.createRole = factory.createOne(Role);

// @des post  update role
// @route  POST api/v1/roles/:id
// @access private
exports.updateRole = factory.updateOne(Role);


// @des delete  role
// @route  DELETE api/v1/roles/:id
// @access private
exports.deleteRole = factory.deleteOne(Role);
