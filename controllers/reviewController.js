// Import the necessary models and dependencies
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModels");

/**
 * @desc     Create a new review
 * @route    /api/v1/reviews/:productId
 * @method   POST
 * @access   Private
 * @param    {string} productId - The ID of the product being reviewed
 * @requires  {number} rating - The rating given to the product (between 1 and 5)
 * @requires  {string} comment - The comment or review text
 * @returns  {Object} The newly created review
 * @requires User Account
 */

const createReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user?.id;

  const product = await Product.findOne({ _id: productId }).lean();

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

  // Check if the user is a user
  if (!req.user.roles.includes("user")) {
    return res.status(403).json({ error: "You are not authorized to review!" });
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      $addToSet: {
        reviews: {
          user: userId,
          rating,
          comment,
        },
      },
    },
    { new: true }
  );

  const totalReviews = updatedProduct.reviews.length;
  const sumRatings = updatedProduct.reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );

  // Calculate the new average rating for the product
  const averageRating = sumRatings / totalReviews;
  updatedProduct.averageRating = averageRating;

  await updatedProduct.save();

  res.status(201).json(updatedProduct);
});

module.exports = {
  createReview,
};
