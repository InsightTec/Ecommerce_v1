const mongoose = require("mongoose");

const handSchema = new mongoose.Schema(
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
    region: {
      type: mongoose.Schema.ObjectId,
      ref: "Region",
    },
    regionCode:String,
    location:{
      latitude:Number,
      longitude:Number
    },
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

const Hand = mongoose.model("Hand", handSchema);

module.exports = Hand;
