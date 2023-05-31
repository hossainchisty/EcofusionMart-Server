// Basic Lib Imports
const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    trim: true,
    required: true,
    index: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: [
    {
      type: String,
      required: false,
    },
  ],
  category: {
    type: String,
    trim: true,
    required: true,
    index: true,
  },
  brand: {
    type: String,
    trim: true,
    required: false,
    index: true,
  },
  stock: {
    inStock: {
      type: Boolean,
      default: true,
    },
    remainingStock: {
      type: Number,
      default: 0,
    },
  },
  SKU: {
    type: String,
    unique: true,
    required: true,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      default: null,
    },
  ],
});

module.exports = mongoose.model("Product", productSchema);
