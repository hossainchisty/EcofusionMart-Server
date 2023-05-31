// Import the necessary models and dependencies
const Product = require('../models/productModels');
const Order = require('../models/orderModels');


/**
 * @desc     Create a new review
 * @route    /api/v1/reviews
 * @method   POST
 * @access   Private
 * @requires Customer Account
 * @param    {string} customerId - The ID of the customer leaving the review
 * @param    {string} productId - The ID of the product being reviewed
 * @param    {number} rating - The rating given to the product (between 1 and 5)
 * @param    {string} comment - The comment or review text
 * @returns  {Object} The newly created review
 */

const createReview = async (customerId, productId, rating, comment) => {
    try {
        // Check if customer has purchased the product
        const order = await Order.findOne({ customer: customerId, "items.product": productId });
        if (!isCustomer) {
            res.status(403).json("Only customers who have purchased the product can leave a review.");
        }

        const review = new Review({
            user: customerId,
            product: productId,
            rating,
            comment,
        });

        await review.save();

        // Add the review to the product's reviews array
        const product = await Product.findById(productId);
        product.reviews.push(review._id);
        await product.save();

        return review;
    } catch (error) {
        res.status(500).json({ error: error });
    }
};



module.exports = {
    createReview
}