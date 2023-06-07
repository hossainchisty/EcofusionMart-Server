// Basic Lib Imports
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/**
 * @desc  Charge payment using the Stripe payment gateway
 * @param {string} paymentMethod - selected payment method
 * @param {string} amount - Total amount to charge for the payment
 */

async function chargePayment(paymentMethod, amount) {
  try {
    // Create a payment intent using the Stripe API
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in cents
      currency: "usd",
      payment_method: paymentMethod,
      confirm: true,
    });

    // Check the payment status
    if (paymentIntent.status === "succeeded") {
      return { success: true, paymentIntentId: paymentIntent.id };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error("Stripe payment failed:", error);
    throw new Error("Stripe payment failed");
  }
}

module.exports = chargePayment;
