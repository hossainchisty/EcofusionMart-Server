// Basic Lib Imports
const express = require("express");
const router = express.Router();

const {
    approveSeller
} = require("../controllers/adminController");

// Routing Implement
router.put("/:sellerId/approve", approveSeller);

module.exports = router;