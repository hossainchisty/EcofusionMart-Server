// Basic Lib Imports
const express = require("express");
const router = express.Router();

const {
  getCart,
  addToCart,
  removeCartItem,
  updateCartItemQuantity,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

// Routing Implement
router.post("/", protect, addToCart);
router.get("/getCarts", protect, getCart);
router.delete("/remove/:itemId", protect, removeCartItem);
router.put("/updateQuantity", protect, updateCartItemQuantity);

module.exports = router;
