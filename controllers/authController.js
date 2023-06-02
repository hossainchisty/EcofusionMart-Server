// Basic Lib Import
const moment = require("moment");
const bcrypt = require("bcryptjs");
const User = require("../models/userModels");
const asyncHandler = require("express-async-handler");
const { generateToken, generateResetToken } = require("../helper/generateToken");
const { sendVerificationEmail, sendResetPasswordLink } = require("../services/sendEmail");

/**
 * @desc    Register new customer or seller
 * @route   /api/v1/users/auth/register
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
    const verificationLink = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/verify?token=${verificationToken}`;
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
 * @route   /api/v1/users/auth/verify
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
 * @route   /api/v1/users/auth/login
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
  const isPasswordValid = await bcrypt.compare(password, user.password);
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
 * @desc     Logs out the currently logged-in user by clearing the authentication token cookie.
 * @route   /api/v1/users/auth/logout
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
 * @route   POST /api/v1/users/auth/forgot-password
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
      return res.status(404).json({ error: 'User not found' });
    }

    const { resetPasswordToken, resetPasswordExpiry } = generateResetToken();

    // Update user document with reset password token and expiry
    await User.findOneAndUpdate(
      { email },
      {
        $set: {
          resetPasswordToken,
          resetPasswordExpiry
        }
      }
    );

    // Send password reset email
    const passwordRestLink = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/reset-password?token=${resetPasswordToken}`;
    sendResetPasswordLink(user.email, passwordRestLink);

    res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

/**
 * @desc    Reset Password
 * @route   POST /api/v1/users/auth/reset-password
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
      resetPasswordExpiry: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports = {
  registerUser,
  emailVerify,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
};
