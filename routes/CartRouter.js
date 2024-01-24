const express = require('express');
const router = express.Router();

const CartController = require('../controllers/CartController');

router.post('/cartItems', CartController.cartItems);
router.post('/addCartItems', CartController.addCartItem);
router.post('/removeCart', CartController.removeCart);

module.exports = router;