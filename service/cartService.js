const Cart = require('../model/Cart');
const Package = require('../model/Package');

const addToCart = async (userId, packageId) => {
  const pkg = await Package.findById(packageId);
  if (!pkg) {
    throw new Error('Package not found');
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, packages: [] });
  }

  const alreadyAdded = cart.packages.some(p => p.packageId.equals(packageId));
  if (alreadyAdded) {
    throw new Error('Package already in cart');
  }

  cart.packages.push({ packageId });
  await cart.save();

  return cart;
};

const getUserCart = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate('packages.packageId');
  return cart ? cart.packages : [];
};

const removeFromCart = async (userId, packageId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new Error('Cart not found');
  }

  cart.packages = cart.packages.filter(p => !p.packageId.equals(packageId));
  await cart.save();

  return cart;
};

module.exports = {
  addToCart,
  getUserCart,
  removeFromCart
};
