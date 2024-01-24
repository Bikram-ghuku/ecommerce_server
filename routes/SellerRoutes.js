const express = require('express');
const router = express.Router();
const SellerController = require('../controllers/SellerController');

router.get('/getAllSellers', SellerController.getAllSellers);
router.post('/getSeller', SellerController.getSeller);

module.exports = router;