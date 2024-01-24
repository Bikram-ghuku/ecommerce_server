const mongoose = require('../services/Mongodb')

const sellerSchema = new mongoose.Schema({
    name: String,
    id: String,
    totSales: Number,
    totOrders: Number
})

const Seller = mongoose.model('sellers', sellerSchema);

module.exports = Seller;