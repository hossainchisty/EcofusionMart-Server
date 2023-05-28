// Basic Lib Imports
const jwt = require("jsonwebtoken");

/**
 * @desc Generate JWT Token
 * @requires User id
 * */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = { generateToken };
