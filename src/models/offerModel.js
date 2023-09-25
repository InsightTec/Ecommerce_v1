const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    name: {type: String,required: [true, "Offer is required"],},
    nameTr: { type: String},
    nameAr: { type: String},
    offer: {type: String}, //example 10-12 % off
    slug:String,
    imageCover:String,
    company: {type: mongoose.Schema.ObjectId,ref: "Company",required: [true, "company is required"],},
    products: [
      {
        product: {type: mongoose.Schema.ObjectId,ref: "Product",},
        quantity: Number,
        price: Number,
        currency:String
      },
    ],
    description: {type: String,maxlength: [2000, "maximun characters must be 5000"],},
    tags: [{type: mongoose.Schema.ObjectId,ref: "Tag",}],
    totalPriceBefore: {type: Number, default: 0,},
    totalPriceAfter: {type: Number, default: 0,},
    currency:{type: String,enum: ["$","€","LT","TRY", "SYP"],default: "$",},
    totalViews:{type: Number,default:0},
    ratingsAverage: {
      type: Number,
      min: [1, "rating must be equal or bigger than 1"],
      max: [5, "rating must be equal or less than 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    start: Date,
    end: Date,
    rank: { type: Number,default: 1,},
    active: {type: Boolean,default: true,},
    deletedAt: Date,
  },
  { timestamps: true }
);

// use mongoose  query middleware
offerSchema.pre(/^find/, function (next) {

 
  this.populate({
    path: "company",
    select: "name ",
  });
  
  this.populate({
    path: "tags",
    select: "name ",
  });
  this.populate({
    path: "products.product",
  //  select: "name ",
  });
  next();
});


module.exports = mongoose.model("Offer", offerSchema);
