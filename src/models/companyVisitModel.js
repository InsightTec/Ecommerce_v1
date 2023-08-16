const mongoose = require("mongoose");

const companyVisitSchema = new mongoose.Schema(
  {
    companyId: {type: mongoose.Schema.Types.ObjectId,ref: 'Company',required: true,},
    userId: {type: mongoose.Schema.Types.ObjectId,ref: 'User'},
    visitDate: {type: Date,default: Date.now,required: true,},
    numVisits: {type: Number,default: 1,required: true,},
 
  },
  { timestamps: true }
);

const CompanyVisit = mongoose.model("CompanyVisit", companyVisitSchema);

module.exports = CompanyVisit;
