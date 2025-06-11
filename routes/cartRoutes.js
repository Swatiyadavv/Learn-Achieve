const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');
const { verifyUserToken } = require('../middleware/userAuth'); // user token middleware

router.post('/add', verifyUserToken, cartController.addToCart);
router.get('/get', verifyUserToken, cartController.getUserCart);
router.delete('/remove/:packageId', verifyUserToken, cartController.removeFromCart);

module.exports = router;
