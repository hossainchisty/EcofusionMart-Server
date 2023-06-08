// Basic Lib Imports
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    delivereAt: {
      type: Date,
      required: false,
    },
    paidAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "canceled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
    },
    shippingAddress: {
      type: String,
    },
    items: [orderItemSchema],
  },
  { timestamps: true },
  { versionKey: false }
);

module.exports = mongoose.model("Order", orderSchema);
