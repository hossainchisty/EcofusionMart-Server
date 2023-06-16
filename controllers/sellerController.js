// Import the necessary models and dependencies
const multer = require("multer");
const Order = require("../models/orderModels");
const upload = require("../config/multerConfig");
const Product = require("../models/productModels");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../config/cloudinaryConfig");

/**
 * @doc     Seller dashboard
 * @route   /api/v1/seller/
 * @method  GET
 * @access  Private
 * @requires Seller Account
 * @returns {Object} The response object containing the seller dashboard data
 */
const sellerDashboard = asyncHandler(async (req, res) => {
  // Check if the seller account is approved by the administrator
  if (!req.user.isApproved) {
    return res.status(403).json({
      error: "Your seller account is not yet approved. Please wait for administrator approval.",
    });
  }

  // Check if the user is a seller
  if (!req.user.roles.includes("seller")) {
    return res.status(403).json({
      error: "You are not authorized to access the seller dashboard",
    });
  }

  const sellerId = req.user._id;

  // Fetch the seller's product listings
  const productsPromise = Product.find({ seller: sellerId });

  // Fetch the seller's order history
  const ordersPromise = Order.find({ seller: sellerId });

  // Wait for both promises to resolve concurrently
  const [products, orders] = await Promise.all([productsPromise, ordersPromise]);

  // Calculate the total earnings for the seller
  const totalEarnings = Number(orders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2));


  res.status(200).json({ products, orders, totalEarnings });
});


/**
 * @desc     Add product listing
 * @route   /api/v1/seller/add/products
 * @method  POST
 * @access  Private
 * @requires Seller Account
 */
const addProducts = asyncHandler(async (req, res) => {
  // middleware to handle file uploads
  upload.array("images")(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: err.message });
    }

    try {
      const user = req.user;

      // Check if the user is a seller
      if (!user.roles.includes("seller")) {
        return res
          .status(403)
          .json({ error: "You are not authorized to add a product listing" });
      }

      // Check if the seller account is approved by the administrator
      if (!user.isApproved) {
        return res.status(403).json({
          error:
            "Your seller account is not yet approved. Please wait for administrator approval.",
        });
      }

      const products = req.body.products;

      // Generate unique SKU values for each product
      const productDocuments = [];

      for (const product of products) {
        const currentDate = new Date().getTime();
        const random = Math.floor(Math.random() * 1000000);
        const SKU = `${random}_${currentDate}`;

        const imageUrls = product.images || [];

        // let imageUrls = [];

        // // Check if images are present in the request
        // if (req.files && req.files.length > 0) {
        //   const files = req.files;

        //   for (const file of files) {
        //     // Upload each image to Cloudinary
        //     const result = await cloudinary.uploader.upload(file.path);

        //     // Push the uploaded image URL to the array
        //     imageUrls.push(result.secure_url);
        //   }
        // }

        const productDocument = new Product({
          title: product.title,
          description: product.description,
          price: product.price,
          taxes: product.taxes,
          shippingFees: product.shippingFees,
          category: product.category,
          brand: product.brand,
          stock: {
            inStock:
              product.stock && product.stock.inStock !== undefined
                ? product.stock.inStock
                : true,
            remainingStock:
              product.stock && product.stock.remainingStock !== undefined
                ? product.stock.remainingStock
                : 0,
          },
          seller: user._id,
          SKU: SKU,
          images: imageUrls,
        });

        productDocuments.push(productDocument);
      }

      // Insert multiple products
      const insertedProducts = await Product.insertMany(productDocuments);

      res.json({
        message: "Products added successfully",
        products: insertedProducts,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

/**
 * @doc     Edits a product listing.
 * @route   /api/v1/seller/products/edit/:productId
 * @method  POST
 * @access  Private
 * @requires Seller Account
 * @returns {Object} The response object containing the updated product information or an error message.
 */
const editProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const {
    title,
    description,
    price,
    taxes,
    shippingFees,
    inStock,
    remainingStock,
  } = req.body;
  const user = req.user;
  try {
    // Check if the user is a seller
    if (!user.roles.includes("seller")) {
      return res
        .status(403)
        .json({ error: "You are not authorized to add a product listing" });
    }

    // Check if the seller account is approved by the administrator
    if (!user.isApproved) {
      return res.status(403).json({
        error:
          "Your seller account is not yet approved. Please wait for administrator approval.",
      });
    }

    const product = await Product.findOne({
      _id: productId,
      seller: user._id,
    }).select("-__v");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
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

    if (taxes) {
      product.taxes = taxes;
    }

    if (shippingFees) {
      product.shippingFees = shippingFees;
    }

    if (typeof inStock === "boolean") {
      product.stock.inStock = inStock;
    }

    if (remainingStock !== undefined) {
      product.stock.remainingStock = remainingStock;
    }

    await product.save();
    res.json({ product: product, message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @doc      View order history
 * @route   /api/v1/seller/oder/history
 * @method  POST
 * @access  Private
 * @requires Seller Account
 */
const viewOrderHistory = asyncHandler(async (req, res) => {
  const user = req.user;
  try {
    // Check if the user is a seller
    if (!user.roles.includes("seller")) {
      return res
        .status(403)
        .json({ error: "You are not authorized to view order history" });
    }

    // Check if the seller account is approved by the administrator
    if (!user.isApproved) {
      return res.status(403).json({
        error:
          "Your seller account is not yet approved. Please wait for administrator approval.",
      });
    }

    const orders = await Order.find({ seller: user._id }).populate(
      "product user"
    );

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @desc    Delete product
 * @route   /api/v1/seller/products/delete/:productId
 * @param  :productId
 * @method  POST
 * @access  Private
 * @requires Seller Account
 */

const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const user = req.user;

  // Check if the user is a seller
  if (!user.roles.includes("seller")) {
    return res.status(403).json({ error: "You are not authorized to delete a product listing" });
  }

  // Check if the seller account is approved by the administrator
  if (!user.isApproved) {
    return res.status(403).json({
      error: "Your seller account is not yet approved. Please wait for administrator approval.",
    });
  }

  const deletedProduct = await Product.findByIdAndRemove(productId);

  if (!deletedProduct) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.status(200).json({ message: "Product was deleted." });
});


/**
 * @desc    Update order status
 * @route   /api/v1/seller/order/:orderId/status
 * @params  :orderId
 * @method  POST
 * @access  Private
 * @requires Seller Account
 */

const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    // Check if the user is a seller
    if (!user.roles.includes("seller")) {
      return res
        .status(403)
        .json({ error: "You are not authorized to add a product listing" });
    }

    // Find the order by its ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update the order status
    order.status = status;

    // Save the updated order
    await order.save();

    res.json({ message: "Order status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sellerDashboard,
  addProducts,
  deleteProduct,
  editProduct,
  viewOrderHistory,
  updateOrderStatus,
};
