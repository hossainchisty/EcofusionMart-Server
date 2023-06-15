// Import necessary models and dependencies
const Product = require("../models/productModels");
const asyncHandler = require("express-async-handler");

/**
 * @desc   Add a product to user's wishlist
 * @route  /api/v1/wishlist/add
 * @property {object} productId
 * @method POST
 * @access Private
 * @requires User authentication
 */

const addToWishlist = asyncHandler(async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if the product is already in the user's wishlist
        const isProductInWishlist = user.wishlist.includes(productId);

        if (isProductInWishlist) {
            return res.status(400).json({ error: 'Product already exists in wishlist' });
        }

        // Add the product to the user's wishlist
        user.wishlist.push(productId);

        await user.save();

        res.json({ message: 'Product added to wishlist' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @desc   Remove a product from user's wishlist
 * @route  /api/v1/wishlist/remove
 * @property {object} productId
 * @method POST
 * @access Private
 * @requires User authentication
 */

const removeFromWishlist = asyncHandler(async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        // Check if the product is in the user's wishlist
        const isProductInWishlist = user.wishlist.includes(productId);

        if (!isProductInWishlist) {
            return res.status(400).json({ error: 'Product does not exist in wishlist' });
        }

        // Remove the product from the user's wishlist
        user.wishlist = user.wishlist.filter(item => item !== productId);

        await user.save();

        res.json({ message: 'Product removed from wishlist' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = {
    addToWishlist,
    removeFromWishlist,
}