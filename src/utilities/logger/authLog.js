const logger=require('./logger');    // winston logger


const addAuthLogData=(about,result,req)=>{
    
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    // add error to winston logger
      var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
              console.log(Object.keys(req.body).length !=0)
      
      const authResult={
        ...(about!='' && { about: about}),
        result:result,
        // user.id to get mongo id in string format, user._id to get id in mongo object format
        ...(req.user && { user: {id:req.user.id,name:req.user.name,email:req.user.email }}),
        ip,
        url,
        method:req.method,
        agent:req.headers['user-agent'],
        ...(Object.keys(req.body).length !=0  && { body:req.body }),
        
      };

      const messageType='Authentication message';
      //this.addErrorLog(messageType,errorResult);
          // user.id to get mongo id in string format, user._id to get id in mongo object format
    logger.warn( messageType, authResult);

}

module.exports=addAuthLogData;