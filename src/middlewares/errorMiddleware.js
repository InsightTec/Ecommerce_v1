const ApiError = require("../utilities/apiError");
const addErrorLogData = require("../utilities/logger/errorLog");

const sendErrorForDev = (err, res) =>

 
   // return error for developer
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack, // when error and where happened
  });

const sendErrorForProd = (err, res) =>
 
   // return error to user
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

const handleJwtInvalidSignature = () =>
  new ApiError("Invalid token, please login again..", 401);

const handleJwtExpired = () =>
  new ApiError("Expired token, please login again..", 401);

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {

     // add error to winston logger
     addErrorLogData(err,req);

    sendErrorForDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = handleJwtInvalidSignature();
    if (err.name === "TokenExpiredError") err = handleJwtExpired();

    
    
    // add error to winston logger
     addErrorLogData(err,req);

    sendErrorForProd(err, res);
  }
};



module.exports = globalError;
