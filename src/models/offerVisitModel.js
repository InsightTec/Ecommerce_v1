const mongoose = require("mongoose");

const offerVisitSchema = new mongoose.Schema(
  {
    offerId: {type: mongoose.Schema.Types.ObjectId,ref: 'Offer',required: true,},
    userId: {type: mongoose.Schema.Types.ObjectId,ref: 'User'},
    visitDate: {type: Date,default: Date.now,required: true,},
    numVisits: {type: Number,default: 1,required: true,},
 
  },
  { timestamps: true }
);

const OfferVisit = mongoose.model("OfferVisit", offerVisitSchema);

module.exports = OfferVisit;
