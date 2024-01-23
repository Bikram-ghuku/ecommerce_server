const mongoose = require('../services/Mongodb')

const addressSchema = new mongoose.Schema({
    uid: String,
    address: String,
    pin: String,
    city: String,
    state: String,
    country: String,
    phone: String
})

const Address = mongoose.model('address', addressSchema);


module.exports = Address;