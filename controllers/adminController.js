// Basic Lib Import
const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");

/**
 * @desc   Approve seller registration
 * @route  PUT /api/admin/:sellerId/approve
 * @method PUT
 * @access Admin
 * @requires Admin role
 */

const approveSeller = asyncHandler(async (req, res) => {
    const { sellerId } = req.params;

    try {
        // Find the user by ID
        const user = await User.findById(sellerId);

        if (!user) {
            return res.status(404).json({ message: "Seller not found" });
        }

        // Check if the user is already approved
        if (user.isApproved) {
            return res.status(400).json({ message: "Seller is already approved" });
        }

        // Update the approval status
        user.isApproved = true;
        await user.save();

        return res.status(200).json({ message: "Seller approved successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});



module.exports = {
    approveSeller
}