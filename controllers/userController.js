// Basic Lib Import
const moment = require("moment");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/userModels");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../helper/generateToken");
const sendVerificationEmail = require("../services/sendEmail");

/**
 * @desc    Register new customer or seller
 * @route   /api/v1/users/register
 * @method  POST
 * @access  Public
 */

const registerUser = asyncHandler(async (req, res) => {
  const { full_name, email, password, avatar, isCustomer, isSeller } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email }).lean();
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Generate verification token
  const verificationToken = crypto.randomBytes(20).toString("hex");
  const verificationTokenExpiry = moment().add(1, "hour"); // Expiration to 1 hour from the current time

  // Validate input fields
  if (
    !full_name ||
    !email ||
    !password ||
    (isCustomer && isSeller) ||
    (!isCustomer && !isSeller)
  ) {
    let errorMessage = "Please provide all required fields.";
    if (!full_name) {
      errorMessage += " 'full_name' field is required.";
    }
    if (!email) {
      errorMessage += " 'email' field is required.";
    }
    if (!password) {
      errorMessage += " 'password' field is required.";
    }
    if (isCustomer && isSeller) {
      errorMessage +=
        " Select either 'isCustomer' or 'isSeller' role, not both.";
    }
    if (!isCustomer && !isSeller) {
      errorMessage += " Select either 'isCustomer' or 'isSeller' role.";
    }
    return res.status(400).json({ message: errorMessage });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const usersToCreate = [
    {
      full_name,
      email,
      avatar,
      isCustomer,
      isSeller,
      verificationToken,
      verificationTokenExpiry,
      password: hashedPassword,
    },
  ];
  const [createdUser] = await User.insertMany(usersToCreate);

  if (createdUser) {
    // Send verification email
    const verificationLink = `http://127.0.0.1:8000/api/v1/users/verify?token=${verificationToken}`;
    sendVerificationEmail(user.email, verificationLink);

    // Set token in a cookie
    const token = generateToken(createdUser._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // TODO: set this to true before production
      sameSite: "Strict",
    });

    return res
      .status(201)
      .json({ message: "Please check your email to verify your account." });
  } else {
    return res.status(400).json({ message: "Invalid user data" });
  }
});

/**
 * @desc    User email verification
 * @route   /api/v1/users/verify
 * @method  POST
 * @param {String} user token
 * @access  Public
 */

const emailVerify = asyncHandler(async (req, res) => {
  const { token } = req.query;

  try {
    // Find the user by verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid verification token" });
    }

    // Check if the verification token has expired
    const now = moment();
    if (now.isAfter(user.verificationTokenExpiry)) {
      return res
        .status(400)
        .json({ message: "Verification token has expired" });
    }

    // Update user as verified
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    user.isVerified = true;
    await user.save();

    return res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

/**
 * @desc    Authenticate a user
 * @route   /api/v1/users/login
 * @method  POST
 * @field   email and password
 * @access  Public
 */

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  const user = await User.findOne({ email }).lean();
  if (!user) {
    return res.status(401).json({ message: "Invalid email" });
  }

  // Compare the provided password with the hashed password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  // Check if the user is a customer or a seller
  if (user.isCustomer) {
    // User is a customer
    // Set token in a cookie
    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // TODO: set this to true before production
      sameSite: "Strict",
    });
    return res.status(200).json({ message: "Customer login successful" });
  } else {
    // Set token in a cookie
    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // TODO: set this to true before production
      sameSite: "Strict",
    });
    return res.status(200).json({ message: "Seller login successful" });
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
 * @desc    Logs out the currently logged-in user by clear cookie token.
 * @route   /api/v1/users/logout
 * @method  POST
 * @access  Private
 * @requires Logged User
 * @returns {string} 200 OK: Returns a success message indicating successful logout.
 */

const logoutUser = asyncHandler(async (req, res) => {
  // Clear the token cookie
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
});

module.exports = {
  registerUser,
  emailVerify,
  loginUser,
  getMe,
  logoutUser,
};
