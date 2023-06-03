// Import the necessary models and dependencies
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModels");

/**
 * @desc     Create a new review
 * @route    /api/v1/reviews
 * @method   POST
 * @access   Private
 * @param    {string} productId - The ID of the product being reviewed
 * @param    {number} rating - The rating given to the product (between 1 and 5)
 * @param    {string} comment - The comment or review text
 * @returns  {Object} The newly created review
 * @requires User Account
 */

const createReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user?.id;

  try {
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    // Check if the user is a user
    if (!req.user.roles.includes("user")) {
      return res
        .status(403)
        .json({ error: "You are not authorized to review!" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const existingReview = product.reviews.find(
      (review) => review.user && review.user.toString() === userId
    );

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product." });
    }

    const review = {
      user: userId,
      rating,
      comment,
    };

    product.reviews.push(review);

    // Calculate the new average rating for the product
    const totalReviews = product.reviews.length;
    const sumRatings = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    product.averageRating = sumRatings / totalReviews;

    const updatedProduct = await product.save();

    res.status(201).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  createReview,
};
