// Import necessary models and libraries
const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModels");
const User = require("../models/userModels");
const Order = require("../models/orderModels");


/**
 * @desc   Place order
 * @route  /order
 * @method POST
 * @access Private
 * @requires User authentication
 */

const placeOrder = asyncHandler(async (req, res) => {
    try {
        const { paymentMethod, shippingAddress } = req.body;
        const userId = req.user.id;

        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        // Create an order and associate it with the user and cart items
        const order = new Order({
            user: userId,
            items: cart.items,
            paymentMethod,
            shippingAddress,
            totalPrice: cart.totalPrice,
        });

        // // Process payment using the payment gateway API
        // const paymentResult = await PaymentGateway.chargePayment(paymentMethod, cart.totalAmount);

        // // Assuming paymentResult contains relevant information about the payment

        // if (paymentResult.success) {
        //     // Save the order and update any necessary models
        //     await order.save();

        //     // Update seller earnings
        //     for (const item of cart.items) {
        //         if (item.product.seller) {
        //             const seller = await User.findOne({ _id: item.product.seller, roles: 'seller' });
        //             if (seller) {
        //                 seller.earnings += item.product.price * item.quantity;
        //                 await seller.save();
        //             }
        //         }
        //     }

            // Clear the user's cart
            cart.items = [];
            await cart.save();

            res.json({ message: 'Order placed successfully', order });
        // } else {
        //     res.status(400).json({ error: 'Payment failed' });
        // }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = {
    placeOrder
}