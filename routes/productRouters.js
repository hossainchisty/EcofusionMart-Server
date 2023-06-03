// Basic Lib Imports
const express = require("express");
const router = express.Router();

const {
  productLists,
  searchProducts,
} = require("../controllers/productController");

// Routing Implement
router.get("/", productLists);
router.get("/search", searchProducts);

module.exports = router;
