const express = require('express');

const router = express.Router();

const ProductController = require('../controllers/ProductController');

router.get('/items', ProductController.items);
router.post('/getProducts', ProductController.getProductes);
router.post('/addProducts', ProductController.addProducts);
router.post('/delProducts', ProductController.delProducts);

module.exports = router;