// Basic Lib Imports
const express = require("express");
const router = express.Router();

const {
    productLists,
} = require("../controllers/productController");

// Routing Implement
router.get("/", productLists);

module.exports = router;