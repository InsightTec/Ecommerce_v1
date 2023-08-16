const {validationResult} = require('express-validator');
const addErrorLogData = require("../utilities/logger/errorLog");

const validatorMiddleware=(req, res,next) => {
 
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      
      //convert errors array to object
      const err= { ...errors.array() };

      // add error to winston logger
        // const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
        // const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

        // const errorResult={
        //   about:req.about,
        //   mesage:err,
        //   ...(req.user && { user: {id:req.user.id,name:req.user.name,email:req.user.email }}),
        //   ip,
        //   url,
        //   body:req.body
        // };
        //const messageType='validation';
      // add error to winston logger
      addErrorLogData(err,req,true);

      return res.status(400).json({ errors: errors.array() });
    }
    next();
}

module.exports=validatorMiddleware;