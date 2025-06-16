const orderService = require('../service/orderService');
const { assignMockTestsToUser } = require('../service/mockTestUserService');

const orderController = {
  placeOrderFromCart: async (req, res) => {
    try {
      const userId = req.user.id;
      const order = await orderService.placeOrderFromCart(userId);

      await assignMockTestsToUser(order, userId);

      res.status(201).json({ message: 'Order placed and mock tests assigned', order });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  placeOrderWithSelectedPackages: async (req, res) => {
    try {
      const userId = req.user.id;
      let { packageIds } = req.body;
      if (!Array.isArray(packageIds)) packageIds = [packageIds];

      const order = await orderService.placeOrderWithSelectedPackages(userId, packageIds);

      await assignMockTestsToUser(order, userId);

      res.status(200).json({ message: 'Order placed and mock tests assigned', order });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};

module.exports = orderController;
