const multer = require("multer");
const fs = require('fs')
const ApiError = require("../utilities/apiError");



exports.deleteSingleImage = (fieldName,folder='products') => {

   const DIR = `src/uploads/${folder}`;
   const fileDir=DIR+'/'+fieldName
   try {
      if (fs.existsSync(fileDir)){
          fs.unlinkSync(fileDir);
      }
  

   return true
   }
   catch(error){
   
    console.log(error)
     return false
   }
};


