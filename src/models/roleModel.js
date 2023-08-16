const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: {type: String,trim: true,required: [true, "name is required"],},
    slug: {type: String,lowercase: true,},
    description: {type: String,trim: true},
    permissions:[{type: mongoose.Schema.ObjectId,ref: "Permission",}],
    rank: {type: Number,default: 1,},
    active: {type: Boolean,default: true,},
    deletedAt: Date,
 
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
