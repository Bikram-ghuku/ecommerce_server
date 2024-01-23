const mongoose = require('./services/Mongodb');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    cart: Array,
    type: String,
    address: Array,
    allow: Boolean
});

const User = mongoose.model('User', userSchema);

module.exports = User;