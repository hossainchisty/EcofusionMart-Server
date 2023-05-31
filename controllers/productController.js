// Import the necessary models and dependencies
const Product = require('../models/productModels');

/**
 * @desc     Lists of all products with pagination
 * @route    GET /api/v1/products/
 * @query    page - Current page number
 * @query    limit - Number of items per page
 * @access   Public
 */
const productLists = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Calculate the starting index of the products based on the page and limit
        const startIndex = (page - 1) * limit;

        // Fetch the products from the database or any other data source
        const products = await Product.find()
            .select('-__v')
            .populate('seller', 'full_name')
            .skip(startIndex)
            .limit(limit)
            .exec();

        // Count the total number of products
        const totalProducts = await Product.countDocuments().exec();

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalProducts / limit);

        res.status(200).json({
            products,
            currentPage: page,
            totalPages,
            totalProducts,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    productLists,
};
