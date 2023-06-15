// Basic Lib Imports
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");

/**
 * @desc Middleware that verify user authorization
 * @protected True
 * @abstract Middle
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      // eslint-disable-next-line prefer-destructuring
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      res.json({ error: error.message });
    }
  }

  if (!token) {
    res.status(401);
    res.json({ error: "Not authorized, no token" });
  }
});

module.exports = { protect };
