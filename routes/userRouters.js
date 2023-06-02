// Basic Lib Imports
const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const {
  userProfile,
} = require("../controllers/userController");

const {
    registerUser,
    emailVerify,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // Limit each IP to 100 create account requests per `window` (here, per hour)
    message:
        "Too many accounts created from this IP, please try again after an hour",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const forgetPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 4, // Limit each IP to 4 create account requests per `window` (here, per hour)
    message:
        "Too many password rest mail send from this IP, please try again after an hour",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Routing Implement
router.post("/login", loginUser);
router.get("/me", protect, userProfile);
router.post("/verify", emailVerify);
router.post("/logout", protect, logoutUser);
router.post("/reset-password", resetPassword);
router.post("/register", createAccountLimiter, registerUser);
router.post("/forgot-password", forgetPasswordLimiter, forgotPassword);

module.exports = router;
