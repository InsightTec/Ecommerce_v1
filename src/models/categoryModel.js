const mongoose = require("mongoose");

// 1- Create Schema
const categorySchema = new mongoose.Schema(
  {
    name: { type: String,required: [true, "category is required"],unique: [true, "category must be unique"], minlength: [3, "minimun characters must be"],maxlength: [32, "maximun characters must be 32"],},
    nameTr: { type: String},
    nameAr: { type: String},
    slug: {type: String, lowercase: true, },
    image: String,
    tags: [{type: mongoose.Schema.ObjectId,ref: "Tag",}],
    rank: { type: Number,default: 1,},
    active: {type: Boolean,default: true,},
    deletedAt: Date,
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.image) {
    //const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    const imageUrl = `${process.env.BASE_URL_LOCAL_REACT_NATIVE}/categories/${doc.image}`;
    
    doc.image = imageUrl;
  }
};
// midlleware
// findOne, findAll and update
categorySchema.post("init", (doc) => {
  setImageURL(doc);
});

// create
categorySchema.post("save", (doc) => {
  setImageURL(doc);
});

// 2- Create model
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
