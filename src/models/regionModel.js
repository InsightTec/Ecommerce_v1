const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    code:String,
    governorate: {
      type: mongoose.Schema.ObjectId,
      ref: "Governorate",
    },
    governorateCode:String,
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

const Region = mongoose.model("Region", regionSchema);

module.exports = Region;
