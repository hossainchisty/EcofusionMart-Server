// Basic Lib Imports
const express = require("express");
const router = express.Router();

const {
    createReview
} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");

// Routing Implement
router.post('/:productId', protect, createReview);

module.exports = router;