// Basic Lib Imports
const express = require("express");
const router = express.Router();

const {
  getLastMonthEarnings,
  getSalesByCategory,
  getBestSellingProducts,
} = require("../controllers/analysisController");

const { protect } = require("../middleware/authMiddleware");

// Routing Implement
router.get("/", protect, getLastMonthEarnings);
router.get("/sales-by-category", protect, getSalesByCategory);
router.get("/best-selling-products", protect, getBestSellingProducts);

module.exports = router;
