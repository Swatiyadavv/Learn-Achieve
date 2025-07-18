const express = require('express');
const router = express.Router();
const { generateInvoice } = require('../controller/invoiceController');

router.get('/generate/:orderId', generateInvoice);

module.exports = router;
