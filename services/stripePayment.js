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
    await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in cents
      currency: "usd",
      payment_method: paymentMethod,
      confirm: true,
    });
  } catch (error) {
    throw new Error("Stripe payment failed");
  }
}

module.exports = chargePayment;
