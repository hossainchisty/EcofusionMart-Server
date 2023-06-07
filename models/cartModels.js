const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { versionKey: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true },
  { versionKey: false }
);

// Virtual property for the total price
cartSchema.virtual('totalPrice').get(function() {
  return this.items.reduce((total, item) => {
    const productPrice = item.product.price || 0;
    return total + productPrice * item.quantity;
  }, 0);
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
