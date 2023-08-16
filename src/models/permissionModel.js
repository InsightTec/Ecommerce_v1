const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    name: {type: String,trim: true,required: [true, "name is required"],},
    model: {type: String,trim: true},
    slug: {type: String,lowercase: true,},
    description: {type: String,trim: true},
    rank: {type: Number,default: 1,},
    active: {type: Boolean,default: true,},
    deletedAt: Date,
 
  },
  { timestamps: true }
);

const Permission = mongoose.model("Permission", permissionSchema);

module.exports = Permission;
