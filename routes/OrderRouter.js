const express = require('express');
const router = express.Router();

const OrderController = require('../controllers/OrdersController');

router.post('/getOrders', OrderController.getOrders);
router.post('/myOrders', OrderController.myOrders);
router.post('/cancelOrder', OrderController.cancelOrder);
router.post('/delOrder', OrderController.delOrder);
router.post('/updateOrder', OrderController.updateOrder);
router.post('/addOrder', OrderController.addOrder);

module.exports = router;