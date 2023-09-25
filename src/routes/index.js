

//======================address==========================================
const countryRoute = require("./countryRoute");
const governorateRoute = require("./governorateRoute");
const regionRoute = require("./regionRoute");
const handRoute = require("./handRoute");

//==============================
const categoryRoute = require("./categoryRoute");
const subCategoryRoute = require("./subCategoryRoute");
const brandRoute = require("./brandRoute");
const companyRoute = require("./companyRoute");
const productRoute = require("./productRoute");
const unitRoute = require("./unitRoute");
const offerRoute = require("./offerRoute");
const tagRoute = require("./tagRoute");
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const reviewRoute = require("./reviewRoute");
const wishlistRoute = require("./wishlistRoute");
const bookmarkRoute = require("./bookmarkRoute");
const addressRoute = require("./addressRoute");
const couponRoute = require("./couponRoute");
const cartRoute = require("./cartRoute");
const orderRoute = require("./orderRoute");
const mainCarouselRoute = require("./mainCarouselRoute");

const mountRoutes = (app) => {
    //======================address==========================================
    app.use("/api/v1/countries", countryRoute);
    app.use("/api/v1/governorations", governorateRoute);
    app.use("/api/v1/regions", regionRoute);
    app.use("/api/v1/hands", handRoute);
 
    //================================
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/subcategories", subCategoryRoute);
  app.use("/api/v1/brands", brandRoute);
  app.use("/api/v1/companies", companyRoute);
  app.use("/api/v1/products", productRoute);
  app.use("/api/v1/units", unitRoute);
  app.use("/api/v1/offers", offerRoute);
  app.use("/api/v1/tags", tagRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/reviews", reviewRoute);
  app.use("/api/v1/wishlist", wishlistRoute);
  app.use("/api/v1/bookmark", bookmarkRoute);
  app.use("/api/v1/addresses", addressRoute);
  app.use("/api/v1/coupons", couponRoute);
  app.use("/api/v1/cart", cartRoute);
  app.use("/api/v1/orders", orderRoute);
  app.use("/api/v1/mainCarousel", mainCarouselRoute);
};

module.exports = mountRoutes;
