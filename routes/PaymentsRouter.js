const express = require('express');

const router = express.Router();

const PaymentsController = require('../controllers/PaymentsController');

router.get('/stripeConfig', PaymentsController.stripeConfig);
router.post('/createPaymentIntent', PaymentsController.createPaymentIntent);
router.post('/getBill', PaymentsController.getBill);

module.exports = router;
