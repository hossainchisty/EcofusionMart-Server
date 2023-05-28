/* eslint-disable camelcase */
// Basic Lib Import
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");
const { generateToken } = require("../helper/generateToken");

/**
 * @desc    Register new user
 * @route   /api/v1/users/register
 * @method  POST
 * @access  Public
 */

const registerUser = asyncHandler(async (req, res) => {
  const { full_name, email, password } = req.body;
  if (!full_name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields.");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    full_name,
    email,
    password: hashedPassword,
    avatar: req.body.avatar,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      full_name: user.full_name,
      email: user.email,
      // eslint-disable-next-line no-underscore-dangle
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

/**
 * @desc    Authenticate a user
 * @route   /api/v1/users/login
 * @method  POST
 * @access  Public
 */

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check for user email
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      console.log("Gone through this");
      res.status(200);
      res.send({
        // eslint-disable-next-line no-underscore-dangle
        token: generateToken(user._id),
        message: "Logged in successfully",
      });
    } else {
      res.status(400);
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(500);
    res.send({ error: error.message });
  }
});

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

/**
 * @desc    Logs out the currently logged-in user by invalidating the JWT token.
 * @route   /api/v1/users/logout
 * @method  POST
 * @access  Private
 * @requires Logged User
 * @returns {string} 200 OK: Returns a success message indicating successful logout.
 */

const logoutUser = asyncHandler(async (req, res) => {
  // Update the user's token to invalidate it
  const { user } = req;
  user.token = "";

  // Save the updated user document
  await user.save();

  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
};
