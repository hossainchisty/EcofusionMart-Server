// Basic Lib Imports
const express = require("express");
const router = express.Router();

const {
  getCart,
  addToCart,
  updateCartItemQuantity,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

// Routing Implement
router.post("/", protect, addToCart);
router.get("/getCarts", protect, getCart);
router.put("/updateQuantity", protect, updateCartItemQuantity);

module.exports = router;
