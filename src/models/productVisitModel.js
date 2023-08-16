const mongoose = require("mongoose");

const productVisitSchema = new mongoose.Schema(
  {
    productId: {type: mongoose.Schema.Types.ObjectId,ref: 'Product',required: true,},
    userId: {type: mongoose.Schema.Types.ObjectId,ref: 'User'},
    visitDate: {type: Date,default: Date.now,required: true,},
    numVisits: {type: Number,default: 1,required: true,},
 
  },
  { timestamps: true }
);

const ProductVisit = mongoose.model("ProductVisit", productVisitSchema);

module.exports = ProductVisit;
