const mongoose = require('mongoose');

// 1- Create Schema
const subCategorySchema = new mongoose.Schema({
  name: {
    type:String,
    trim:true,
    required:[true,"subcategory is required"],
    unique:[true,"subcategory must be unique"],
    minlength:[3,"minimun characters must be"],
    maxlength:[32,"maximun characters must be 32"]


  },
  slug:{
    type:String,
    lowercase:true
  },
  category:{
    type:mongoose.Schema.ObjectId,
    ref:'Category',
    required:[true,"category is required"],
  }
},{timestamps:true});

// 2- Create model
const subCategoryModel = mongoose.model('subCategory', subCategorySchema);

module.exports = subCategoryModel;
