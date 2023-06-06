// Basic Lib Imports
const express = require("express");
const router = express.Router();

const { getCart, addToCart } = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

// Routing Implement
router.get("/getCarts", protect, getCart);
router.post("/", protect, addToCart);

module.exports = router;
