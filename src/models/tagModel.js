const mongoose = require("mongoose");

// 1- Create Schema
const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brand is required"],
      unique: [true, "brand must be unique"],
      minlength: [1, "minimun characters must be"],
      maxlength: [32, "maximun characters must be 32"],
    },
   
    slug: {
      type: String,
      lowercase: true,
    },
    type: {type: String,enum: ["public","company","product", "offer", "category","brand"],default: "public",},
    rank: { type: Number,default: 1,},
    active: {type: Boolean,default: true,},
    deletedAt: Date,
   
  },
  { timestamps: true }
);


// 2- Create model
const tagModel = mongoose.model("Tag", tagSchema);

module.exports = tagModel;
