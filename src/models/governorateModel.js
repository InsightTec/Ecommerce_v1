const mongoose = require("mongoose");

const governorateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name required"],
    },
    nameTr: { type: String},
    nameAr: { type: String},
    slug: {
      type: String,
      lowercase: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
    },
    code:String,
    countryCode:String,
    rank: {
      type: Number,
      default: 1,
    },
    active: {
      type: Boolean,
      default: true,
    },
    deletedAt: Date,
 
  },
  { timestamps: true }
);

const Governorate = mongoose.model("Governorate", governorateSchema);

module.exports = Governorate;
