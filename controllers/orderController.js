// Import necessary models and libraries
const User = require("../models/userModels");
const Product = require("../models/productModels");
const Cart = require("../models/cartModels");
const Order = require("../models/orderModels");
const asyncHandler = require("express-async-handler");
const chargePayment = require("../services/stripePayment");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/**
 * @desc   Place order
 * @route  /api/v1/order
 * @method POST
 * @access Private
 * @requires User authentication
 */

const placeOrder = asyncHandler(async (req, res) => {
  try {
    const { paymentMethod, shippingAddress } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    // Create an order and associate it with the user and cart items
    const order = new Order({
      user: userId,
      items: cart.items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
      })),
      paymentMethod,
      shippingAddress,
      totalPrice: cart.totalPrice,
    });

    // Create a PaymentIntent using the Stripe API
    const paymentIntent = await chargePayment(paymentMethod, cart.totalPrice);

    // Check the payment status
    if (paymentIntent.status === "succeeded") {
      // Update seller earnings and associate user role with the order
      for (const item of cart.items) {
        const productId = item.product;
        const product = await Product.findById(productId).exec();

        if (product) {
          const user = await User.findById(userId).exec();
          if (user && user.roles.includes("seller")) {
            user.earnings += product.price * item.quantity;
            await user.save();
          }
          order.seller = product.seller;
        }
      }

      order.paidAt = Date.now();
      await order.save();

      // Clear the user's cart
      cart.items = [];
      await cart.save();

      res.json({ message: "Order placed successfully", order });
    } else {
      res.status(400).json({ error: "Payment failed" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  placeOrder,
};
