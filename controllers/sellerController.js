// Import the necessary models and dependencies
const Product = require('../models/productModels');
const Order = require('../models/orderModels');

/**
 * @doc     Fetch seller dashboard data
 * @route   /api/v1/seller/
 * @method  GET
 * @access  Private
 * @requires Seller Account
 * @returns {Object} - The response object containing the seller dashboard data
*/
const getSellerDashboard = async (req, res) => {
  try {
    const seller = req.user; // Assuming user information is available in the request

    // Check if the user is a seller
    if (!seller.isSeller) {
      return res.status(403).json({ error: 'You are not authorized to access the seller dashboard' });
    }

    // Fetch the seller's product listings
    const products = await Product.find({ seller: seller._id });

    // Fetch the seller's order history
    const orders = await Order.find({ seller: seller._id });

    // Calculate the total earnings for the seller
    const totalEarnings = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Respond with the dashboard data
    res.json({ products, orders, totalEarnings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * @desc     Add product listing
 * @route   /api/v1/seller/add/products
 * @method  POST
 * @access  Private
 * @requires Seller Account
 */
const addProducts = async (req, res) => {
  try {
    const seller = req.user;

    // Check if the user is a seller
    if (!seller.isSeller) {
      return res.status(403).json({ error: 'You are not authorized to add a product listing' });
    }

    const products = req.body.products;

    // Generate unique SKU values for each product
    const productDocuments = products.map(product => {
      const currentDate = new Date().getTime();
      const random = Math.floor(Math.random() * 1000000);
      const SKU = `${random}_${currentDate}`;

      return {
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        brand: product.brand,
        stock: {
          inStock: product.stock && product.stock.inStock !== undefined ? product.stock.inStock : true,
          remainingStock: product.stock && product.stock.remainingStock !== undefined ? product.stock.remainingStock : 0,
        },
        seller: seller._id,
        SKU: SKU,
      };
    });

    // Insert multiple products
    await Product.insertMany(productDocuments);
    res.json({ message: 'Products added successfully' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

/**
 * @doc     Edits a product listing.
 * @route   /api/v1/seller/products/edit/:productId
 * @method  POST
 * @access  Private
 * @requires Seller Account
 * @returns {Object} - The response object containing the updated product information or an error message.
*/
const editProduct = async (req, res) => {
  try {
    const seller = req.user;
    const { productId } = req.params;
    const { title, description, price, inStock, remainingStock } = req.body;

    // Check if the user is a seller
    if (!seller.isSeller) {
      return res.status(403).json({ error: 'You are not authorized to edit the product listing' });
    }

    const product = await Product.findOne({ _id: productId, seller: seller._id }).select("-__v");

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update only the provided fields
    if (title) {
      product.title = title;
    }

    if (description) {
      product.description = description;
    }

    if (price) {
      product.price = price;
    }

    if (typeof inStock === 'boolean') {
      product.stock.inStock = inStock;
    }

    if (remainingStock !== undefined) {
      product.stock.remainingStock = remainingStock;
    }

    await product.save();
    res.json({ product: product, message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

/**
 * @doc      View order history
 * @route   /api/v1/seller/oder/history
 * @method  POST
 * @access  Private
 * @requires Seller Account
*/
const viewOrderHistory = async (req, res) => {
  try {
    const seller = req.user; // Assuming user information is available in the request

    // Check if the user is a seller
    if (!seller.isSeller) {
      return res.status(403).json({ error: 'You are not authorized to view the order history' });
    }

    const orders = await Order.find({ seller: seller._id }).populate('product customer');

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports = {
  getSellerDashboard,
  addProducts,
  editProduct,
  viewOrderHistory
};
