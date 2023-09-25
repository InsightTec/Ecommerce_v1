const mongoose = require("mongoose");

// 1- Create Schema
const unitSchema = new mongoose.Schema(
  {
    name: { type: String,required: [true, "unit is required"],unique: [true, "unit must be unique"], minlength: [3, "minimun characters must be"],maxlength: [32, "maximun characters must be 32"],},
    nameTr: { type: String},
    nameAr: { type: String},
    slug: {type: String, lowercase: true, },
    rank: { type: Number,default: 1,},
    active: {type: Boolean,default: true,},
    deletedAt: Date,
  },
  { timestamps: true }
);


// 2- Create model
const unitModel = mongoose.model("Unit", unitSchema);

module.exports = unitModel;
