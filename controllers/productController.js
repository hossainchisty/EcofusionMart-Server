// Import the necessary models and dependencies
const NodeCache = require("node-cache");
const cache = new NodeCache();
const Product = require("../models/productModels");
const asyncHandler = require("express-async-handler");

/**
 * @desc     Lists of all products with pagination
 * @route    /api/v1/products/
 * @method   GET
 * @query    page - Current page number
 * @query    limit - Number of items per page
 * @access   Public
 */
const productLists = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  // Validate and sanitize the 'page' and 'limit' query parameters
  const validatedPage = Math.max(1, Math.floor(page));
  const validatedLimit = Math.max(1, Math.floor(limit));

  // Calculate the starting index of the products based on the page and limit
  const startIndex = (validatedPage - 1) * validatedLimit;

  // Fetch only the required products for the current page using 'skip' and 'limit' methods of the MongoDB query
  const products = await Product.find()
    .select("-__v")
    .populate("seller", "full_name")
    .skip(startIndex)
    .limit(validatedLimit)
    .exec();

  // Cache the total number of products and update it only when a product is added or removed
  const totalProducts =
    (await cache.get("totalProducts")) ||
    (await Product.countDocuments().exec());
  if (!cache.get("totalProducts")) {
    cache.set("totalProducts", totalProducts);
  }

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalProducts / validatedLimit);

  res.status(200).json({
    status: "success",
    code: 200,
    message: "Data retrieved successfully",
    products,
    currentPage: validatedPage,
    totalPages,
    totalProducts,
  });
});

/**
 * @desc     Search products based on criteria
 * @route    /api/v1/products/search
 * @method   GET
 * @param    {string} [req.query.category] - The category to filter products by (case-insensitive).
 * @param    {number} [req.query.priceMin] - The minimum price of products to filter by.
 * @param    {number} [req.query.priceMax] - The maximum price of products to filter by.
 * @param    {string} [req.query.brand] - The brand to filter products by.
 * @param    {string} [req.query.title] - The title to search products by (case-insensitive).
 * @param    {string} [req.query.priceSort] - The sort order for price ('asc' or 'desc').
 * @param    {string} [req.query.popularitySort] - The sort order for popularity ('asc' or 'desc').
 * @returns  {object[]} - An array of products matching the search criteria.
 * @throws   {Error} - If an internal server error occurs.
 * @access   Public
 */

const searchProducts = asyncHandler(async (req, res) => {
  try {
    const cacheKey = JSON.stringify(req.query);

    const cachedResults = cache.get(cacheKey);

    if (cachedResults) {
      return res.status(200).json({ result: cachedResults });
    }

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

    if (products.length === 0) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "No products found.",
      });
    }

    const productsWithoutSubdocuments = products.map((product) => {
      const productObject = product.toObject();
      delete productObject.reviews;
      return productObject;
    });

    cache.set(cacheKey, productsWithoutSubdocuments);

    res.status(200).json({
      status: "success",
      code: 200,
      result: productsWithoutSubdocuments,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal server error.",
    });
  }
});

module.exports = {
  productLists,
  searchProducts,
};
