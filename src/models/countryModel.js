const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema(
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
    code:String,
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

const Country = mongoose.model("Country", countrySchema);

module.exports = Country;
