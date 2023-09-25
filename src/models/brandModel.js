const mongoose = require("mongoose");

// 1- Create Schema
const brandSchema = new mongoose.Schema(
  {
    name: {type: String,},
    nameTr: {type: String,},
    nameAr: {type: String,},

    slug: {
      type: String,
      lowercase: true,
    },
    tags: [{type: mongoose.Schema.ObjectId,ref: "Tag",}],
    image: String,
    rank: {type: Number,default: 1,},
    active: {type: Boolean,default: true,},
    deletedAt: Date,
 
   
  },
  { timestamps: true }
);
const setImageURL = (doc) => {
  if (doc.image) {
   // const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    const imageUrl = `${process.env.BASE_URL_LOCAL_REACT_NATIVE}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

// findOne, findAll and update
// brandSchema.post("init", (doc) => {
//   setImageURL(doc);
// });

// // create
// brandSchema.post("save", (doc) => {
//   setImageURL(doc);
// });

// 2- Create model
const brandModel = mongoose.model("Brand", brandSchema);

module.exports = brandModel;
