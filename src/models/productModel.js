const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      minlength: [3, "minimun characters must be"],
      maxlength: [100, "maximun characters must be 100"],
    },
    titleTr: { type: String},
    titleAr: { type: String},
    slug: {
      type: String,
      lowercase: true,
    },
  
    description: {
      type: String,
      maxlength: [2000, "maximun characters must be 5000"],
    },
    quantity: {
      type: Number,
      required: [true, "description is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "price is required"],
      trim: true,
      maxlength: [10, "maximun characters must be 10"],
    },
    priceAfterDiscount: {
      type: Number,
      max: [2000, "maximun characters must be 2000"],
    },
    colors: [String],
    imageCover: {
      type: String,
    },
    images: [String],
    company: {
      type: mongoose.Schema.ObjectId,
      ref: "Company",
      required: [true, "company is required"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "category is required"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "subCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    unit: {
      type: mongoose.Schema.ObjectId,
      ref: "Unit",
    },
    tags: [{type: mongoose.Schema.ObjectId,ref: "Tag",}],
    currency:{type: String,enum: ["$","€","TRY",'₺', "SYP"],default: "$",},
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
    rank: { type: Number,default: 1,},
    active: {type: Boolean,default: true,},
    deletedAt: Date,
  },
  {
    timestamps: true,
    // to enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

// use mongoose  query middleware
productSchema.pre(/^find/, function (next) {

  this.populate({
    path: "category",
    select: "name nameTr nameAr",
  });
  this.populate({
    path: "company",
  //  select: "name phone locations",
  });
  this.populate({
    path: "unit",
    //select: "name ",
  });
  this.populate({
    path: "brand",
    select: "name ",
  });
  this.populate({
    path: "tags",
    select: "name nameTr nameAr",
  });
  next();
});
// Mongoose query middleware
// productSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "category",
//     select: "name ",
//   });
//   next();
// });


const setImageURL = (doc) => {
  if (doc.imageCover) {
   // const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    const imageUrl = `${process.env.BASE_URL_LOCAL_REACT_NATIVE}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imagesList = [];
    doc.images.forEach((image) => {
   //   const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      const imageUrl = `${process.env.BASE_URL_LOCAL_REACT_NATIVE}/products/${image}`;
      imagesList.push(imageUrl);
    });
    doc.images = imagesList;
  }
};

// Pre middleware for find and findOne queries
// productSchema.pre("find", (doc) => {
//   setImageURL(doc);
// });
// let isFindQuery = false; // Flag to indicate if it's a find query

// productSchema.pre(/^find(?!.*update)/, function (next) {
//   // 'this' refers to the query object
//   // You can modify the query object to add conditions or customize the find operation

//   // Set the flag to indicate it's a find query
//   isFindQuery = true;

//   // Continue with the middleware chain
//   next();
// });

// midlleware
// findOne, findAll and update
// productSchema.post(/^find(?!.*update)/, (doc) => {
//   console.log('isFindQuery',isFindQuery)
//   console.log('only find')
//   console.log('doc',doc)
//   setImageURL(doc);
//   isFindQuery = false;
// },{ only: 'find' });

// create
// productSchema.post("save", (doc) => {
//   setImageURL(doc);
// });

// 2- Create model
const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
