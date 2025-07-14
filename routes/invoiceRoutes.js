const express = require('express');
const router = express.Router();
const { generateInvoice } = require('../controller/invoiceController');

router.post('/generate', generateInvoice);

module.exports = router;
