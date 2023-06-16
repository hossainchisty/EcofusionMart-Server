// Basic Lib Import
const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");

/**
 * @desc   Approve seller registration
 * @route  /api/v1/admin/:sellerId/approve
 * @method PUT
 * @access Admin
 * @requires Admin role
 */

const approveSeller = asyncHandler(async (req, res) => {
  const { sellerId } = req.params;

  // Find the user by ID and update the approval status
  const updatedUser = await User.findOneAndUpdate(
    { _id: sellerId, isApproved: false },
    { $set: { isApproved: true } },
    { new: true }
  );

  if (!updatedUser) {
    return res.status(404).json({ message: "Seller not found" });
  }

  if (updatedUser.isApproved) {
    return res.status(400).json({ message: "Seller is already approved" });
  }

  return res.status(200).json({ message: "Seller approved successfully" });
});

/**
 * @desc   Get all users
 * @route  /api/v1/admin/users
 * @method GET
 * @access Admin
 * @requires Admin role
 */

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().select("-__v");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @desc   Get a user by ID
 * @route  /admin/users/:userId
 * @method GET
 * @access Admin
 * @requires Admin role
 */
const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @desc   Update a user's account details
 * @route  /admin/users/:userId
 * @method PUT
 * @access Admin
 * @requires Admin role
 */
const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { full_name, email, phone_number } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's account details
    user.full_name = full_name;
    user.email = email;
    user.phone_number = phone_number;

    await user.save();

    res
      .status(200)
      .json({ message: "User account details updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  approveSeller,
  getAllUsers,
  getUserById,
  updateUser,
};
