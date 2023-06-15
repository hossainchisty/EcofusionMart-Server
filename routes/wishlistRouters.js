// Basic Lib Imports
const express = require("express");
const router = express.Router();

const {
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

const { protect } = require("../middleware/authMiddleware");

// Routing Implement
router.post("/add", protect, addToWishlist);
router.post("/remove", protect, removeFromWishlist);

module.exports = router;
