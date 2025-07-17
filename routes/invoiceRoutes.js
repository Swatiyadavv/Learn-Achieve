const express = require('express');
const router = express.Router();
const { generateInvoice } = require('../controller/invoiceController');

router.get('/generate', generateInvoice);

module.exports = router;
