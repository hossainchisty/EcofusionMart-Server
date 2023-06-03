// Import the necessary models and dependencies
const Product = require("../models/productModels");

/**
 * @desc     Lists of all products with pagination
 * @route    /api/v1/products/
 * @method   GET
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
      .select("-__v")
      .populate("seller", "full_name")
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

/**
 * @desc     Search products based on criteria
 * @route    /api/v1/products/search
 * @method   GET
 * @param  {string} [req.query.category] - The category to filter products by (case-insensitive).
 * @param {number} [req.query.priceMin] - The minimum price of products to filter by.
 * @param {number} [req.query.priceMax] - The maximum price of products to filter by.
 * @param {string} [req.query.brand] - The brand to filter products by.
 * @param {string} [req.query.title] - The title to search products by (case-insensitive).
 * @param {string} [req.query.priceSort] - The sort order for price ('asc' or 'desc').
 * @param {string} [req.query.popularitySort] - The sort order for popularity ('asc' or 'desc').
 * @returns {object[]} - An array of products matching the search criteria.
 * @throws {Error} - If an internal server error occurs.
 * @access   Public
 */
const searchProducts = async (req, res) => {
  try {
    const filterOptions = {
      category: req.query.category
        ? { $regex: new RegExp(req.query.category, "i") }
        : null,
      priceMin: parseFloat(req.query.priceMin) || null,
      priceMax: parseFloat(req.query.priceMax) || null,
      brand: req.query.brand
        ? { $regex: new RegExp(req.query.brand, "i") }
        : null,
      title: req.query.title
        ? { $regex: new RegExp(req.query.title, "i") }
        : null,
    };

    const sortOptions = {
      price: req.query.priceSort || null,
      popularity: req.query.popularitySort || null,
    };

    const products = await Product.filterAndSort(filterOptions, sortOptions);

    res.status(200).json({ result: products });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports = {
  productLists,
  searchProducts,
};
