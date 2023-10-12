const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const asyncHandler = require("express-async-handler");
const ApiError = require("../utilities/apiError");
const createToken = require("../utilities/createToken");
const sendEmail = require("../utilities/sendEmail");
const addAuthLogData=require("../utilities/logger/authLog");

const User = require("../models/userModel");

// @desc    Signup
// @route   GET /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
  // 1- Create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role:req.body.role
   // roles:req.body.roles
  });

  // 2- Generate token
  const token = createToken(user._id);

  // add authentication  to winston logger
  // addAuthLogData(`Sign up a new user`,user,req);

  res.status(201).json({ data: user, token });
});

//=============================

//=============================
// @desc    Login
// @route   GET /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  // 1) check if password and email in the body (validation)
  // 2) check if user exist & check if password is correct
  

  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401,'Login authentication '));
  }
 
  // 3) generate token
  const token = createToken(user._id);

  // Delete password from response
  delete user._doc.password;

    // add authentication  to winston logger
   // addAuthLogData(`login a user`,user,req);

  // 4) send response to client side
  res.status(200).json({ data: user, token });
});

// @desc   make sure the user is logged in
// here protect without permissions
exports.protect = asyncHandler(async (req, res, next) => {
  //console.log('header', req.headers)
  // 1) Check if token exist, if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }


  if (!token || token =='null') {
    return next(
      new ApiError(
        "You are not login, Please login to get access this route",
        401
      )
    );
  }

  // 2) Verify token (no change happens, expired token)

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
  // 3) Check if user exists
  const currentUser = await User.findById(decoded.userId);


  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist",
        401
      )
    );
  }

  // 4) Check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    // getTime convert time to timestamp in miliseconds ,we divide 1000 to convert to seconds
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // Password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his password. please login again..",
          401
        )
      );
    }
  }

  req.user = currentUser;
 
  next();
});
// @desc   make sure the user is logged in
exports.protectWithPermissions = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist, if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }


  
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
                    .populate({path: 'roles',select:'name', populate: [{ path: 'permissions',select:'name' }]});


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
  if (currentUser.passwordChangedAt) {
    // getTime convert time to timestamp in miliseconds ,we divide 1000 to convert to seconds
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // Password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his password. please login again..",
          401,
          'Authentication'

        )
      );
    }
  }

  req.user = currentUser;

   const userRoles= req.user.roles;
  //  get all permissions in all roles and merge it in req.user.userpermissions
  const userpermissions=[];
   await Promise.all(
    userRoles.map(async(role) =>{
    const rolePermissions=  role.permissions;
       rolePermissions.map(async(permission)=>{
      // console.log(permission.name)
      userpermissions.push(permission.name)
    })
      
    }
   ));
   if(userpermissions.length>0)
      req.user.userpermissions=userpermissions;
   
     
  next();
});

// @desc    Authorization (User Permissions)
// ["admin", "manager"]
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
   // console.log('roles==================='+roles)
    // 1) access roles
    // 2) access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403 ,'Role Authorization ')
      );
    }
    next();
  });

  exports.allowedToPermission = (permission) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)
    if(req.user.userpermissions.length>0)
    {
       // const userPermissions=req.user.roles[0].permissions;
        const userPermissions=req.user.userpermissions;
      // console.log(userPermissions);
       
        // if ( userPermissions.map(p => p.name).indexOf(permission) === -1 ) {
       if ( userPermissions.indexOf(permission) === -1 ) {
            return next(
              new ApiError("You are not allowed to access this route", 403,'Permission Authorization')
            );
          }
      next();
    }
    else{
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }

     
    
  });

  exports.allowedToRole = (role) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)
    
       const userRoles=req.user.roles;
      // console.log(userRoles);
       
    if ( userRoles.map(r => r.name).indexOf(role) === -1 ) {
      return next(
        new ApiError("You are not allowed to access this route", 403,'Role Authorization')
      );
    }
    next();
  });


// @desc    Forgot password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with that email ${req.body.email}`, 404,'Forget password')
    );
  }
  // 2) If user exist, Generate hash reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // Save hashed password reset code into db
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  // 3) Send the reset code via email
  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
       // add authentication  to winston logger
       addAuthLogData(`Forgot a Password`,user,req);

    return next(new ApiError("There is an error in sending email", 500,'Sending email'));
  }

  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
});

// @desc    Verify password reset code
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Reset code invalid or expired",400,'Verify password'));
  }

  // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();

      // add authentication  to winston logger
      addAuthLogData(`Verify password`,user,req);

  res.status(200).json({
    status: "Success",
  });
});

// @desc    Reset password
// @route   POST /api/v1/auth/resetPassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with email ${req.body.email}`, 404,'Reset password')
    );
  }

  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400,'Reset password'));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) if everything is ok, generate token
  const token = createToken(user._id);

      // add authentication  to winston logger
      addAuthLogData(`Reset password`,user,req);

  res.status(200).json({ token });
});
