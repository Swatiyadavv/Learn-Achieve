const orderService = require('../service/orderService');
const crypto = require('crypto');
const orderController = {
  //  Place order from cart
  placeOrderFromCart: async (req, res) => {
    try {
      const userId = req.user.id;

      if (!userId) {
        return res.status(400).json({ message: 'User ID not found in request' });
      }

      const order = await orderService.placeOrderFromCart(userId);
      res.status(201).json({ message: 'Order placed from cart successfully', order });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Get all orders by user ID
getAllOrdersByUserId: async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;  // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default limit to 10

    if (!userId) {
      return res.status(400).json({ message: 'User ID not found in request' });
    }

    const orders = await orderService.getAllOrdersByUserId(userId, page, limit);
    res.status(200).json({ message: 'Orders fetched successfully', page, limit, orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
},


  //  Place order with selected packageIds
  placeOrderWithSelectedPackages: async (req, res) => {
    try {
      const userId = req.user.id;
      let { packageIds } = req.body;

      if (!userId) {
        return res.status(400).json({ message: 'User ID not found in request' });
      }

      if (!packageIds || !Array.isArray(packageIds)) {
        return res.status(400).json({ message: 'packageIds must be a non-empty array' });
      }

      const order = await orderService.placeOrderWithSelectedPackages(userId, packageIds);
      res.status(200).json({ message: 'Order placed successfully', order });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Get invoice by order ID
  getInvoiceByOrderId: async (req, res) => {
    try {
      const { orderId } = req.params;

      if (!orderId) {
        return res.status(400).json({ message: 'Order ID is required in params' });
      }

      const invoice = await orderService.getInvoiceByOrderId(orderId);
      res.status(200).json({ message: 'Invoice generated successfully', invoice });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }
};

module.exports = orderController;
