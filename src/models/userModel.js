
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {type: String,trim: true,required: [true, "name is required"],},
    slug: {type: String,lowercase: true,},
    email: {type: String},
    phone: String,

    profileImg: String,
    company: {type: mongoose.Schema.ObjectId,ref: "Company",},
    password: {type: String,required: [true, "password is required"],minlength: [6, "Too short password"],},
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    language: {type:String,default: "English"},
    isDarkTheme:{type:Boolean,default: true},
    role: {type: String,enum: ["company","user", "superAdmin", "admin"],default: "admin",},
   // roles:[{type: mongoose.Schema.ObjectId,ref: "Role",}],
    // child reference (one to many)
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    bookmark: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Company",
      },
    ],
    addresses: [
      {
        // to autogenerate Ids
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
        image:String,
        default:{type: Boolean,default: false,},
        active:{type: Boolean,default: true,}
      },
    ],
    locations:[{
      location:{latitude:String,longitude:String},
      default:{type: Boolean,default: false,},
      active:{type: Boolean,default: true,}
    }],
    place:{
      country: {type: mongoose.Schema.ObjectId,ref: "Country"},
      governorate: {type: mongoose.Schema.ObjectId,ref: "Governorate",},
      region: {type: mongoose.Schema.ObjectId,ref: "Region",},
      hand: {type: mongoose.Schema.ObjectId,ref: "Hand",},
   },
    settings:{
      sendOrderByWhatsApp:{type:Boolean,Default:true},
    },
    options:{
      homeCompanies: {type: [String],enum: ["hand","region","governorate","country", "gpsLocation"],default: ["region"],},
      nearestDistance:{type: Number,default: 100000,}, // unit in meter
    },
    active: {type: Boolean,default: true,},
    deletedAt: Date,
    
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  // this.isModified work only if we have a password in request req.body.password
  if (!this.isModified("password")) return next();
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.pre(/^find/, function (next) {
 
  this.populate({
    path: "company",
    select: "name ",
  });
 
  next();
});
const User = mongoose.model("User", userSchema);

module.exports = User;
