// Import necessary models and libraries
const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModels");

/**
 * @desc   Add product to cart
 * @route  /api/v1/cart
 * @method POST
 * @access Private
 * @requires User authentication
 */

const addToCart = asyncHandler(async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // If the user doesn't have a cart yet, create a new one
      const newCart = new Cart({ user: userId });
      newCart.items.push({ product: productId, quantity });
      await newCart.save();
    } else {
      // Check if the product already exists in the cart
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingItemIndex !== -1) {
        // If the product already exists, update the quantity
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // If the product doesn't exist, add it to the cart
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    res.json({ message: "Product added to cart" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @desc   Get cart items
 * @route  /api/v1/cart/getCarts
 * @method GET
 * @access Private
 * @requires User authentication
 */
const getCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId })
      .select("-__v")
      .populate("items.product");

    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  getCart,
  addToCart,
};
