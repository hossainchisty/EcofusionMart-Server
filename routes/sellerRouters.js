// Basic Lib Imports
const express = require("express");
const router = express.Router();

const {
  sellerDashboard,
  addProducts,
  editProduct,
  deleteProduct,
  updateOrderStatus,
} = require("../controllers/sellerController");

const {
  registerSeller,
  loginSeller,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// Routing Implement
router.get("/", protect, sellerDashboard);
router.post("/register", registerSeller);
router.post("/login", loginSeller);
router.post("/add/products", protect, addProducts);
router.post("/products/delete/:productId", protect, deleteProduct);
router.put("/products/edit/:productId", protect, editProduct);
router.put("/order/:orderId/status", protect, updateOrderStatus);

module.exports = router;
