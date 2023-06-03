// Basic Lib Imports
const express = require("express");
const router = express.Router();

const {
    approveSeller,
    getAllUsers,
    getUserById,
} = require("../controllers/adminController");

// Routing Implement
router.get("/users", getAllUsers);
router.put("/:sellerId/approve", approveSeller);
router.get("/users/:userId", getUserById).put("/users/:userId", getUserById);

module.exports = router;