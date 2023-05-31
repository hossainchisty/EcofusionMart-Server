// Basic Lib Imports
const express = require("express");
const router = express.Router();

const {
  addProducts,
  editProduct
} = require("../controllers/sellerController");


const { protect } = require("../middleware/authMiddleware");

// Routing Implement
router.post("/add/products", protect, addProducts);
router.put("/products/edit/:productId", protect, editProduct);

module.exports = router;