// Basic Lib Import
const asyncHandler = require("express-async-handler");


/**
 * @desc    Get user data
 * @route   /api/v1/users/me
 * @method  GET
 * @access  Private
 * @requires Logged User
 */
const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});


module.exports = {
  getMe
};
