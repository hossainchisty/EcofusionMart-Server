// Basic Lib Import
const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");

/**
 * @desc    Get user details
 * @route   /api/v1/users/me
 * @method  GET
 * @access  Private
 * @requires Logged User
 */
const userProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select('-__v')
    .lean();
  if (!user.roles.includes("user")) {
    const user = await User.findById(req.user.id)
    .select('-__v -roles -earnings -resetPasswordExpiry -resetPasswordToken -password')
    .lean();
    res.status(200).json(user);
  }
  
  if (!user.roles.includes("seller")) {
    const user = await User.findById(req.user.id)
    .select('-__v -roles -resetPasswordExpiry -resetPasswordToken -password')
    .lean();
    res.status(200).json(user);
  }
});

module.exports = {
  userProfile,
};
