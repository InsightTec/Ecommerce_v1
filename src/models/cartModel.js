const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        color: String,
        price: Number,
        currency:String
      },
    ],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    currency:String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    company: {
      type: mongoose.Schema.ObjectId,
      ref: "Company",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
