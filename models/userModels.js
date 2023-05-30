// Basic Lib Imports
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    full_name: {
      index: true,
      type: String,
      required: [true, "Please add a full name"],
      trim: true,
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
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
    },
    avatar: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
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
      required: false
    },
    otp: {
      type: String,
      required: false
    },
    verificationToken: {
      type: String
    },
    verificationTokenExpiry: {
      type: Date
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpiry: {
      type: Date,
    },
  },
  { timestamps: true },
  { versionKey: false }
);

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = mongoose.model("User", userSchema);
