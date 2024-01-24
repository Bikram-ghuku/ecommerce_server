const express = require('express');
const router = express.Router();

const AddressController = require('../controllers/AddressController');

router.post('/addAddress', AddressController.addAddress);
router.post('/getAddress', AddressController.getAddress);

module.exports = router;