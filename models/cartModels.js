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

// Virtual property for the sub total
cartSchema.virtual("subTotal").get(function () {
  return this.items.reduce((total, item) => {
    const productPrice = item.product.price || 0;
    return total + productPrice * item.quantity;
  }, 0);
});

// Virtual property for the taxes
cartSchema.virtual("taxes").get(function () {
  return this.items.reduce((total, item) => {
    if (item.product && item.product.price) {
      const taxes = item.product.taxes || 0;
      return total + taxes * item.quantity;
    }
    return total;
  }, 0);
});

// Virtual property for the shipping fees
cartSchema.virtual("shippingFees").get(function () {
  return this.items.reduce((total, item) => {
    if (item.product && item.product.price) {
      const shippingFees = item.product.shippingFees || 0;
      return total + shippingFees * item.quantity;
    }
    return total;
  }, 0);
});

// Virtual property for the total shipping charges
cartSchema.virtual("totalPrice").get(function () {
  const subtotal = this.subTotal || 0;
  const taxes = this.taxes || 0;
  const shippingFees = this.shippingFees || 0;

  const total = subtotal + taxes + shippingFees;
  return total;
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
