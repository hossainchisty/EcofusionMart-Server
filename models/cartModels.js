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

// Virtual property for the Subtotal 
cartSchema.virtual("Subtotal").get(function () {
  return this.items.reduce((total, item) => {
    const productPrice = item.product.price || 0;
    return total + productPrice * item.quantity;
  }, 0);
});

// Virtual property for the taxes 
cartSchema.virtual("taxes").get(function () {
  return this.items.reduce((total, item) => {
    const taxes = item.product.taxes || 0;
    return total + taxes * item.quantity;
  }, 0);
});

// Virtual property for the shipping fees 
cartSchema.virtual("shippingFees").get(function () {
  return this.items.reduce((total, item) => {
    const shippingFees = item.product.shippingFees || 0;
    return total + shippingFees * item.quantity;
  }, 0);
});

// Virtual property for the total price of the product including shipping, taxes.
cartSchema.virtual("totalPrice").get(function () {
  return this.items.reduce((total, item) => {
    const productPrice = item.product.price || 0;
    const totalPriceWithTaxesAndFees = (productPrice + item.taxes + item.shippingFees) * item.quantity;
    return total + totalPriceWithTaxesAndFees;
  }, 0);
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
