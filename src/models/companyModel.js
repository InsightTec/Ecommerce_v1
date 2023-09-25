const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  
    {
      name: {
        type: String,
        required: [true, "Store is required"],
        unique: [true, "store must be unique"],
        minlength: [3, "minimun characters must be"],
        maxlength: [32, "maximun characters must be 32"],
      },
      nameTr: { type: String},
      nameAr: { type: String},
    description:String,
      slug: {
        type: String,
        lowercase: true,
      },
      email:String,
      QRCode:String,
      image: String,
      tags: [{type: mongoose.Schema.ObjectId,ref: "Tag",}],
      place:{
        country: {type: mongoose.Schema.ObjectId,ref: "Country"},
        governorate: {type: mongoose.Schema.ObjectId,ref: "Governorate",},
        region: {type: mongoose.Schema.ObjectId,ref: "Region",},
        hand: {type: mongoose.Schema.ObjectId,ref: "Hand",},
     },
     address: {type: String,trim: true,required: [true, "Address is  required"],},
     locations:[{
       location:{latitude:String,longitude:String},
       active:{type: Boolean,default: true,}
     }],
    openStatus:Boolean,
    openFromTo:[{
      start:String,
      end:String,
      active:Boolean
    }],
    totalViews:{type: Number,default:0},
     
      phone: {type: String,trim: true,required: [true, "phone is  required"],},
      ratingsAverage: {
        type: Number,
        min: [1, "rating must be equal or bigger than 1"],
        max: [5, "rating must be equal or less than 5"],
      },
      ratingsQuantity: {
        type: Number,
        default: 0,
      },
      rank: {type: Number,default: 1,},
      active: {type: Boolean,default: true,},
      deletedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

const setImageURL = (doc) => {
 
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL_LOCAL_REACT_NATIVE}/companies/${doc.image}`;
    doc.image = imageUrl;
  }
};
// midlleware
// findOne, findAll and update
// companySchema.post("init", (doc) => {
//   setImageURL(doc);
// });

// // create
// companySchema.post("save", (doc) => {
//   setImageURL(doc);
// });
// use mongoose  query middleware
companySchema.pre(/^find/, function (next) {
  this.populate({
    path: "tags",
    select: "name ",
  });
  this.populate({
    path: "place.country",
    select: "name ",
  });
  this.populate({
    path: "place.governorate",
    select: "name ",
  });
  this.populate({
    path: "place.region",
    select: "name ",
  });
  this.populate({
    path: "place.hand",
    select: "name ",
  });
 
  next();
});


const Company = mongoose.model("Company", companySchema);

module.exports = Company;
