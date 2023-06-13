const Product = require("../models/productModels");
const User = require("../models/userModels");
const seedUser = require("../seeds/user");
const seedProduct = require("../seeds/product");

/**
 * @desc     Inserting three different user roles into the database
 * @route   /api/seed/users/
 * @method  GET
 * @disclaimer This endpoint is experimental don't use in production environments
 * @author Hossain Chisty
 */

const seedUsers = async (req, res) => {
  try {
    // Delete all existing users
    await User.deleteMany({});

    // Insert new users
    const users = await User.insertMany(seedUser.users);
    res
      .status(201)
      .json({ message: "User seeding data inserted successfully", users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc     Seeding products data in the database
 * @route   /api/seed/products/
 * @method  GET
 * @disclaimer This endpoint is experimental don't use in production environments
 * @author Hossain Chisty
 */

const seedProducts = async (req, res) => {
  try {
    // Delete all existing products
    await Product.deleteMany({});

    // Insert new users
    const products = await Product.insertMany(seedProduct.products);
    res
      .status(201)
      .json({
        message: "Product seeding data inserted successfully",
        products,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  seedUsers,
  seedProducts,
};
