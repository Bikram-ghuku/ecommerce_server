const mongoose = require('../services/Mongodb')

const itemsSchema = new mongoose.Schema({
    pdtName: String,
    img: String,
    desc: String,
    cost: Number,
    opts: Array,
    dispType: String,
    seller: String,
    rating: Number
})

const Items = mongoose.model('items', itemsSchema);

module.exports = Items;