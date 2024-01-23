const mongoose = require('../services/Mongodb')

const orderSchema = new mongoose.Schema({
    uid: String,
    pid: String,
    sid: String,
    qty: Number,
    status: String,
    address: String,
    paymentIntent: String
})

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;