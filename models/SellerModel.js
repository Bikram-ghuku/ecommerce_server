const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    name: String,
    id: String,
    totSales: Number,
    totOrders: Number
})

const Seller = mongoose.model('sellers', sellerSchema);