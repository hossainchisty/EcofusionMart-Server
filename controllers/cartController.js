const Cart = require("../models/cartModels");
const Product = require("../models/productModels");

/**
 * @desc     Items add in cart
 * @access   Private
 */
const addCart = async (req, res, next) => {
    const user = req.user;
    if (!user.isUser) {
        return res.status(402).json("User must be login");
    }
    try {
        const productId = req.params.id;
        const productQuantity = req.params.quantity;
        const cart = await Cart.findOne({ user: user._id });
        if (!cart) {
            cart.user = user._id;
            cart.items = { product: productId, quantity: productQuantity };
        } else {
            cart.items.push = { product: productId, quantity: productQuantity };
        }

        cart.save();
        return res.status(200).json("Item add in cart successfully");
    } catch (error) {
        return res.status(200).json("Item not add in cart");
    }
};

/**
 * @desc     Get all cart items
 * @query    items
 * @access   Private
 */

const viewCart = async (req, res, next) => {
    const user = req.user;
    if (!user.isUser) {
        return res.status(402).json("User must be login");
    }
    try {
        const cart = await Cart.findOne({ user: user._id }).populate(
            "items.product",
            "-_id"
        );
        return res.status(200).json(cart);
    } catch (error) {
        return res.status(200).json("Cart items not found");
    }
};

/**
 * @desc     Delete Cart items
 * @query    Delete
 * @access   Private
 */

const deleteCart = async (req, res, next) => {
    const user = req.user;
    if (!user.isUser) {
        return res.status(402).json("User must be login");
    }
    try {
        const productId = req.params.id;
        const cart = await Cart.findOne({ user: user._id }).populate(
            "items.product",
            "-_id"
        );
        cart.items.filter((items) => items.product === productId);
        cart.items.save();
        return res.status(200).json(cart);
    } catch (error) {
        return res.status(200).json("Cart items not found");
    }
};

module.exports = { addCart, viewCart, deleteCart };
