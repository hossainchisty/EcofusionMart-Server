// Basic Lib Import
const moment = require("moment");
const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/userModels");
const asyncHandler = require("express-async-handler");
const {
  generateToken,
  generateResetToken,
} = require("../helper/generateToken");
const {
  sendVerificationEmail,
  sendResetPasswordLink,
} = require("../services/sendEmail");

/**
 * @desc They can access various features such as searching for products, adding    items to the cart, making payments, and tracking orders. Users can also provide feedback and ratings for products and sellers.
 * @route   /api/v2/users/auth/register
 * @method  POST
 * @access  Public
 */

const registerUser = asyncHandler(async (req, res) => {
  const { full_name, email, password, avatar } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email }).lean();
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Validate input fields
  if (!full_name || !email || !password) {
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
      verificationToken: crypto.randomBytes(20).toString("hex"),
      verificationTokenExpiry: moment().add(1, "hour"),
      password: hashedPassword,
    },
  ];
  const [createdUser] = await User.insertMany(usersToCreate);

  if (createdUser) {
    // Send verification email
    const verificationLink = `${req.protocol}://${req.get(
      "host",
    )}/api/v2/users/auth/verify?token=${createdUser.verificationToken}`;
    sendVerificationEmail(createdUser.email, verificationLink);

    // Set token in a cookie
    const token = generateToken(createdUser._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
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
 * @desc    Set up a seller account, list their products, manage inventory, and handle order processing.
 * @route   /api/v2/seller/register
 * @method  POST
 * @access  Public
 */

const registerSeller = asyncHandler(async (req, res) => {
  const {
    full_name,
    phone_number,
    email,
    NID,
    address,
    bank_account,
    password,
    avatar,
  } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User already exists, update user data
      user.roles = ["user", "seller"];
      user.full_name = full_name;
      user.phone_number = phone_number;
      user.NID = NID;
      user.address = address;
      user.bank_account = bank_account;
      user.avatar = avatar;

      // Update hashed password if provided
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
      }

      await user.save();

      return res.status(200).json({
        message:
          "User role updated to seller successfully. Please wait for approval.",
      });
    }

    // Create new seller account
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      full_name,
      phone_number,
      email,
      NID,
      address,
      bank_account,
      password: hashedPassword,
      avatar,
      roles: ["seller"],
      verificationToken: crypto.randomBytes(20).toString("hex"),
      verificationTokenExpiry: Date.now() + 3600000, // 1 hour from now
    });

    await user.save();

    // Send verification email
    const verificationLink = `${req.protocol}://${req.get(
      "host"
    )}/api/v2/users/auth/verify?token=${user.verificationToken}`;
    sendVerificationEmail(user.email, verificationLink);

    // Set token in a cookie
    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return res.status(201).json({
      message:
        "Seller registered successfully. Please check your email to verify your account and wait for approval.",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/**
 * @desc    User email verification
 * @route   /api/v2/users/auth/verify
 * @method  POST
 * @param   {String} user token
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
 * User to log in using either their email or phone number
 * @route   /api/v2/users/auth/login
 * @method  POST
 * @field   email and password
 * @access  Public
 */

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email format
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    // Check if the user exists
    const user = await User.findOne(
      { email, roles: "user" },
      { password: 1 }
    ).lean();

    if (!user) {
      return res.status(401).json({ error: "Invalid email" });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate and set the token as a cookie
    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Sellers to log in using either their email or phone number
 * @route   /api/v2/seller/login
 * @method  POST
 * @field   phone_number/email and password
 * @access  Public
 */
const loginSeller = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  try {
    let user;

    // Check if the identifier is a valid email
    if (validator.isEmail(identifier)) {
      user = await User.findOne({ email: identifier, roles: "seller" }).lean();
    }
    // Check if the identifier is a valid phone number
    else if (validator.isMobilePhone(identifier, "any")) {
      user = await User.findOne({
        phone_number: identifier,
        roles: "seller",
      }).lean();
    }

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email, phone number, or user type" });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    if (user) {
      const token = generateToken(user._id);
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      });
      return res.status(200).json({ message: "Login successful" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/**
 * @desc     Logs out the currently logged-in user by clearing the authentication token cookie.
 * @route   /api/v2/users/auth/logout
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

/**
 * @desc    Forgot Password
 * @route   POST /api/v2/users/auth/forgot-password
 * @method  POST
 * @access  Public
 * @param   {string} email - User's email address
 * @returns {object} - Success message or error message
 */
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { resetPasswordToken, resetPasswordExpiry } = generateResetToken();

    // Update user document with reset password token and expiry
    await User.findOneAndUpdate(
      { email },
      {
        $set: {
          resetPasswordToken,
          resetPasswordExpiry,
        },
      },
    );

    // Send password reset email
    const passwordRestLink = `${req.protocol}://${req.get(
      "host",
    )}/api/v2/users/reset-password?token=${resetPasswordToken}`;
    sendResetPasswordLink(user.email, passwordRestLink);

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

/**
 * @desc    Reset Password
 * @route   POST /api/v2/users/auth/reset-password
 * @method  POST
 * @access  Public
 * @param   {string} token - Reset password token received in email
 * @param   {string} newPassword - User's new password
 * @returns {object} - Success message or error message
 */
const resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  const { token } = req.query;

  try {
    // Find user by the reset password token and ensure it's valid and not expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports = {
  registerUser,
  registerSeller,
  loginSeller,
  emailVerify,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
};
