const mongoose = require("mongoose");

// 1- Create Schema
const mainCarouselSchema = new mongoose.Schema(
  {
    captionLarge: String,
    captionSmall: String,
    image: String,
    // as example : if urlType is company here provide _id of company or slug
    url:String,
     // type to deternine scope to caarousel
     type: {type: String,enum: ["home","company", "user"],default: "home",},
     //  urlType to determine if url insame app as company,offer,product or category , or in external link
    urlType: {type: String,enum: ["url","company", "offer","category","product"],default: "company",},
    rank: {type: Number,default: 1,},
    active: {type: Boolean,default: true,},
    deletedAt: Date,
   
  },
  { timestamps: true }
  
);
const setImageURL = (doc) => {
  if (doc.image) {
   // const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    const imageUrl = `${process.env.BASE_URL_LOCAL_REACT_NATIVE}/mainCarousel/${doc.image}`;
    doc.image = imageUrl;
  }
};

// findOne, findAll and update
mainCarouselSchema.post("init", (doc) => {
  setImageURL(doc);
});

// create
mainCarouselSchema.post("save", (doc) => {
  setImageURL(doc);
});

// 2- Create model
const mainCarouselModel = mongoose.model("MainCarousel", mainCarouselSchema);

module.exports = mainCarouselModel;
