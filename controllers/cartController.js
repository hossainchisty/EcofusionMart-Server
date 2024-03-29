// Import necessary models and libraries
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModels");
const Cart = require("../models/cartModels");

/**
 * @desc   Add product to cart
 * @route  /api/v1/cart
 * @method POST
 * @access Private
 * @requires User authentication
 */

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  const cart = await Cart.findOne({ user: userId });

  const product = await Product.findById(productId).lean();

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Check if the product is in stock
  if (!product.stock.inStock) {
    return res.status(400).json({ error: "Product is out of stock" });
  }

  // Check if the requested quantity is available in stock
  if (quantity > product.stock.remainingStock) {
    return res.status(400).json({ error: "Insufficient stock" });
  }

  if (!cart) {
    // If the user doesn't have a cart yet, create a new one
    const newCart = new Cart({ user: userId });
    newCart.items.push({ product: productId, quantity });
    await newCart.save();
  } else {
    // Check if the product already exists in the cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
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
});

/**
 * @desc   Remove an item from the user's cart
 * @route  /api/cart/remove/:itemId
 * @param {String} itemId
 * @method DELETE
 * @access Private
 * @requires User authentication
 */

const removeCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.id;

  const cart = await Cart.findOne({ user: userId });

  // Find the index of the item to be removed
  const itemIndex = cart.items.findIndex((item) => item.id === itemId);

  if (itemIndex === -1) {
    return res.status(404).json({ error: "Item not found in cart" });
  }

  // Remove the item from the cart
  cart.items.splice(itemIndex, 1);
  await cart.save();

  res.json({ message: "Item removed from cart" });
});

/**
 * @desc   Get cart items
 * @route  /api/v1/cart/getCarts
 * @method GET
 * @access Private
 * @requires User authentication
 */

const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart) {
    res.status(404).json({ message: "Cart is empty" });
  }
  const subTotal = cart.subTotal;
  const taxes = cart.taxes;
  const shippingFees = cart.shippingFees;
  const totalPrice = cart.totalPrice;

  res.status(200).json({ cart, subTotal, taxes, shippingFees, totalPrice });
});

/**
 * @desc   Update the quantity of a cart item
 * @route  /api/v1/cart/updateQuantity
 * @method PUT
 * @access Private
 * @requires User Authentication
 * @deprecated Since v0.24.0 we already update the quantity of a cart item from add to cart items
 */

const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { cartItemId, quantity } = req.body;
  const userId = req.user.id;

  const cart = await Cart.findOne({ user: userId });

  // Find the cart item by its ID
  const cartItem = cart.items.find((item) => item.id === cartItemId);

  if (!cartItem) {
    return res.status(404).json({ error: "Cart item not found" });
  }

  // Update the quantity of the cart item
  cartItem.quantity = quantity;

  await cart.save();

  res
    .status(200)
    .json({ message: "Cart item quantity updated successfully", cart });
});

module.exports = {
  getCart,
  addToCart,
  removeCartItem,
  updateCartItemQuantity,
};
