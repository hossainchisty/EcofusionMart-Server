// Basic Lib Import
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModels");
const Order = require("../models/orderModels");


/**
 * @desc   Get best-selling products by units sold
 * @route  /api/v1/analysis/best-selling-products?startDate=2023-01-01&endDate=2023-05-31
 * @method GET
 * @access Sellers
 * @requires Seller role
 */

const getBestSellingProducts = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    // Group orders by product and calculate total units sold
    const productSales = await Order.aggregate([
        { $match: { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
        { $group: { _id: '$product', totalUnitsSold: { $sum: '$quantity' } } },
        { $sort: { totalUnitsSold: -1 } }
    ]);

    // Retrieve product details for the best-selling products
    const productIds = productSales.map((productSale) => productSale._id);
    const bestSellingProducts = await Product.find({ _id: { $in: productIds } });

    res.json({ bestSellingProducts });
});



/**
 * @desc   Get sales distribution by product categories
 * @route  /api/v1/analysis/
 * @method GET
 * @access Sellers
 * @requires Seller role
 */

const getSalesByCategory = asyncHandler(async (req, res) => {

    const salesByCategory = await Order.aggregate([
        {
            $lookup: {
                from: 'products',
                localField: 'product',
                foreignField: '_id',
                as: 'productDetails'
            }
        },
        {
            $unwind: '$productDetails'
        },
        {
            $group: {
                _id: '$productDetails.category',
                totalSales: { $sum: '$quantity' },
                totalEarnings: { $sum: '$earnings' }
            }
        },
        {
            $project: {
                _id: 0, // Exclude the _id field from the results
                category: '$_id',
                totalSales: 1,
                totalEarnings: 1
            }
        },
        {
            $sort: { totalSales: -1 } // Sort by totalSales in descending order
        }
    ]);

    res.json(salesByCategory);
});


/**
 * @desc   Calculating the earnings in the last 30 days
 * @route  /api/v1/analysis/
 * @method GET
 * @access Sellers
 * @requires Seller role
 */

const getLastMonthEarnings = asyncHandler(async (req, res) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: thirtyDaysAgo }
            }
        },
        {
            $group: {
                _id: null,
                totalEarnings: { $sum: '$earnings' }
            }
        }
    ]);

    const earnings = result.length > 0 ? result[0].totalEarnings : 0;

    res.json({ earnings });
});


module.exports = {
    getLastMonthEarnings,
    getSalesByCategory,
    getBestSellingProducts,
}