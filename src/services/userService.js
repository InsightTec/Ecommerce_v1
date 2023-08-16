const asyncHandler = require("express-async-handler");

const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createToken = require("../utilities/createToken");
const ApiFeatures = require("../utilities/apiFeatures");
const addActivityLogData=require("../utilities/logger/activityLog");
const factory = require("./handlersFactory");
const ApiError = require("../utilities/apiError");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const User = require("../models/userModel");

// Upload single image
// profileImg is the sended name  in req.body
exports.uploadUserImage = uploadSingleImage("profileImg");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);

    // Save image into our db
    req.body.profileImg = filename;
  }

  next();
});

exports.createFilterRoleObj = (req, res, next) => {
  // if nested route
  let roleObject = {};
  if (req.query.role) roleObject = { 'roles': { $in: [mongoose.Types.ObjectId(req.query.role) ] } };
  //if (req.query.role) roleObject ={ : { $in: [ mongoose.Types.ObjectId(req.query.role) ] } };
  // add new value to req
  req.roleObject = roleObject;
  // console.log('req.params'+JSON.stringify(req.query))
  // console.log('req.roleObject'+JSON.stringify(req.roleObject))
  next();
};

// @desc    Get list of users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers =  asyncHandler(async (req, res) => {
  // for nested routes in subCategories
  let filter = {};
  if (req.roleObject) {
    filter = req.roleObject;
  }
//console.log('filter'+JSON.stringify(filter))
  
  // get total number of brands
  const documentsCounts = await User.countDocuments();
  // req.query={}
  // let r=await User.find({ 'roles': { $in: [mongoose.Types.ObjectId("642721725961725b9b3d63a3") ] } });
  // console.log(r)
  //Build query
 // const apiFeatures = new ApiFeatures(User.find(filter).populate([{path: 'roles',select:'name'}]), req.query)
  const apiFeatures = new ApiFeatures(User.find(filter), req.query)
    .paginate(documentsCounts).search('user')
    .limitFields()
    .sort();

  //execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  // const products = await apiFeatures.mongooseQuery;

  const documents = await mongooseQuery;

  // add activity to winston logger
 // addActivityLogData(`get all  users`,`Total users retrieved is ${documents.length}`,req);
   

  res
    .status(200)
    .json({ results: documents.length, paginationResult, data: documents });
})


// @desc    Get specific user by id
// @route   GET /api/v1/users/:id
// @access  Private/Admin
//exports.getUser = factory.getOne(User,{path: 'roles', populate: [{ path: 'permissions',select:'name' }]});
//exports.getUser = factory.getOne(User);
exports.getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // 1) Build query here not use await to build
  let query = User.findById(id)
  .populate({
    path: "company",
    select: "name ",
  });
 

  // 2) Execute query , here use await for execute
  const document = await query;

  if (!document) {
    return next(new ApiError(`No User for this id ${id}`, 404));
  }
  res.status(200).json({ data: document });
});

// @desc    Get specific user by id
// @route   GET /api/v1/users/info/:slug
// @access  Private/Admin
exports.getUserBySlug = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;
  // 1) Build query here not use await to build
  let query = User.findOne({slug})
  //.populate({path:'roles',select:'name'});
 

  // 2) Execute query , here use await for execute
  const document = await query;

  if (!document) {
    return next(new ApiError(`No User for this slug ${slug}`, 404,`get User`));
  }

 // addActivityLogData(`get one User details`,document._doc,req);

  res.status(200).json({ data: document });
})

// @desc    Create user
// @route   POST  /api/v1/users
// @access  Private/Admin
exports.createUser = factory.createOne(User);

// @desc    Update specific user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      roles: req.body.roles,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});


exports.changeUserPasswordAdmin = asyncHandler(async (req, res, next) => {

  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});


// @des delete  delete user
// @route  DELETE api/v1/users/:id
// @access private
exports.deleteUser = factory.deleteOne(User);
// @desc    Get Logged user data
// @route   GET /api/v1/users/getMe
// @access  Private/Protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc    Update logged user password
// @route   PUT /api/v1/users/updateMyPassword
// @access  Private/Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
 
  const {email,password,newPassword}=req.body
  // 1) Update user password based user payload (req.user._id)

  const checkUser = await User.findById(req.user._id)
 
  if( !(checkUser.email=== email && await bcrypt.compare(password, checkUser.password))){
     console.log('email',email)
     return next(new ApiError("Incorrect email or password", 401,'change password authentication '));
  }
 

     console.log('2')
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.newPassword, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  console.log('3')
  // 2) Generate token
  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});

// @desc    Update logged user data (without password, role)
// @route   PUT /api/v1/users/updateMe
// @access  Private/Protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
 
//  console.log(req.user)
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    //{
      req.body
      // name: req.body.name,
      // email: req.body.email,
      // phone: req.body.phone,
   // }
    ,
    { new: true }
  );

  res.status(200).json({ data: updatedUser });
});

// @desc    Deactivate logged user
// @route   DELETE /api/v1/users/deleteMe
// @access  Private/Protect
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: "Success" });
});

// @desc   make sure the user is logged in

  exports.authMe = asyncHandler(async (req, res, next) => {
    // 1) Check if token exist, if exist get
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
  //  console.log('t='+token)
    if (!token) {
      return next(
        new ApiError(
          "You are not login, Please login to get access this route",
          401,
          'authentication'
        )
      );
    }
  
    // 2) Verify token (no change happens, expired token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
    // 3) Check if user exists
    const currentUser = await User.findById(decoded.userId)
                     // .populate({path: 'roles',select:'name', populate: [{ path: 'permissions',select:'name' }]});
  
    
   //  console.log('currentUser'+currentUser)
  
           // console.log(currentUser);
    if (!currentUser) {
      return next(
        new ApiError(
          "The user that belong to this token does no longer exist",
          401,
          'Token expire'
        )
      );
    }
  
    // 4) Check if user change his password after token created
   
 
   //  const userRoles= currentUser.roles;
   
    //  get all permissions in all roles and merge it in req.user.userPermissions
   // const userPermissions=[];
    //  await Promise.all(
    //   userRoles.map(async(role) =>{
    //   const rolePermissions=  role.permissions;
    //      rolePermissions.map(async(permission)=>{
    //     // console.log(permission.name)
    //     userPermissions.push(permission.name)
    //   })
        
    //   }
    //  ));

     //console.log('userPermissions'+userPermissions);
     
  
  
        res.status(200).json({
           user: currentUser ,
           //permissions:userPermissions
          });
  });

  exports.authMe = asyncHandler(async (req, res, next) => {
    // 1) Check if token exist, if exist get
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
  //  console.log('t='+token)
    if (!token) {
      return next(
        new ApiError(
          "You are not login, Please login to get access this route",
          401,
          'authentication'
        )
      );
    }
  
    // 2) Verify token (no change happens, expired token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
    // 3) Check if user exists
    const currentUser = await User.findById(decoded.userId)
                      //.populate({path: 'roles',select:'name', populate: [{ path: 'permissions',select:'name' }]});
  
    
   //  console.log('currentUser'+currentUser)
  
           // console.log(currentUser);
    if (!currentUser) {
      return next(
        new ApiError(
          "The user that belong to this token does no longer exist",
          401,
          'Token expire'
        )
      );
    }
  
    // 4) Check if user change his password after token created
   
 
   //  const userRoles= currentUser.roles;
   
    //  get all permissions in all roles and merge it in req.user.userPermissions
    // const userPermissions=[];
    //  await Promise.all(
    //   userRoles.map(async(role) =>{
    //   const rolePermissions=  role.permissions;
    //      rolePermissions.map(async(permission)=>{
    //     // console.log(permission.name)
    //     userPermissions.push(permission.name)
    //   })
        
    //   }
    //  ));

     //console.log('userPermissions'+userPermissions);
     
  
  
        res.status(200).json({ 
          user: currentUser 
          //,permissions:userPermissions
        });
  });
  
  