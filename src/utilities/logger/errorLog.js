const logger=require('./logger');    // winston logger


const addErrorLogData=(err,req,isValidationError=false)=>{
    
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    // add error to winston logger
      var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
              
      const errorResult={
        ...(req.about && { about: req.about}),
       // mesage:isValidationError?err:err.message,
        mesage:isValidationError?err:err,
        // user.id to get mongo id in string format, user._id to get id in mongo object format
        ...(req.user && { user: {id:req.user.id,name:req.user.name,email:req.user.email }}),
        ip,
        url,
        method:req.method,
        agent:req.headers['user-agent'],
        ...(Object.keys(req.body).length !=0  && { body:req.body }),
      };

      const messageType=isValidationError?'Validation Error':'Error message';
      //this.addErrorLog(messageType,errorResult);
          // user.id to get mongo id in string format, user._id to get id in mongo object format
    logger.error( messageType, errorResult);

}

module.exports=addErrorLogData;