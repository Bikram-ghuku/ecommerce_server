const stripe = require('stripe')(process.env.STRIPE_SK_KEY);

module.exports = stripe;