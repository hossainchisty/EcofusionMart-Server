// Basic Lib Imports
const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    full_name: {
      index: true,
      type: String,
      trim: true,
      required: [true, "User full name is required"],
      minlength: [3, "The minimum length of the name must be between 3 characters"],
      maxlength: [25, "The maximum length of the name must be between 25 characters"]
    },
    phone_number: {
      index: true,
      type: Number,
      unique: false,
      required: [false, "Please add an phone number"],
    },
    email: {
      type: String,
      index: true,
      unique: true,
      trim: true,
      required: [true, "User email is required"],
    },
    avatar: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: [true, "User password is required"],
      minlength: [6, 'The password must be at least 6 characters']
    },
    isSeller: {
      index: true,
      type: Boolean,
      default: false,
    },
    isCustomer: {
      index: true,
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      required: false,
    },
    otp: {
      type: String,
      required: false,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpiry: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpiry: {
      type: Date,
    },
    earnings: {
      type: Number,
      default: 0
    },
  },
  { timestamps: true },
  { versionKey: false }
);


module.exports = mongoose.model("User", userSchema);
