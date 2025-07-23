const Cart = require('../model/Cart');
const Package = require('../model/Package');

// Calculate summary for cart
const calculateSummary = (packages) => {
  let subTotal = 0;
  let discountAmt = 0;

  packages.forEach(pkg => {
    subTotal += pkg.totalPrice;
    discountAmt += (pkg.actualPrice - pkg.finalPrice) || 0;
  });

  const grandTotal = subTotal;
  const grandTotalCoordinator = subTotal - discountAmt;

  return {
    subTotal: subTotal.toFixed(2),
    discountAmt: discountAmt.toFixed(2),
    grandTotal: grandTotal.toFixed(2),
    grandTotalCoordinator: grandTotalCoordinator.toFixed(2)
  };
};

// Add package to user's cart
const addToCart = async (userId, packageId) => {
  const pkg = await Package.findById(packageId);
  if (!pkg) throw new Error("Package not found");

  const actualPrice = pkg.actualPrice || 0;
  const finalPrice = pkg.finalPrice || 0;
  const discountPrice = actualPrice - finalPrice;
  const totalPrice = finalPrice;

  const packageToAdd = {
    packageId: pkg._id,
    name: pkg.packageName,
    platform: pkg.platform,
    medium: pkg.medium,
    image: pkg.image,
    actualPrice,             // Added
    finalPrice,
    discountPrice,
    quantity: 1,
    totalPrice,
  };

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({
      userId,
      packages: [packageToAdd],
      summary: calculateSummary([packageToAdd])
    });
  } else {
    const existing = cart.packages.find(p => p.packageId.toString() === packageId);
    if (existing) throw new Error("Package already in cart");

    cart.packages.push(packageToAdd);
    cart.summary = calculateSummary(cart.packages);
  }

  await cart.save();

  return {
    message: "Package added to cart",
    cartCount: cart.packages.length,
    cartList: cart.packages.map(item => ({
      cart_id: cart._id,
      package_id: item.packageId,
      name: item.name,
      platform: item.platform,
      medium: item.medium,
      image: item.image,
      finalPrice: item.finalPrice,
      quantity: item.quantity,
    discountPrice: item.discountPrice, 

      totalPrice: item.totalPrice
    })),
    summary: cart.summary
  };
};

// Get user's cart
const getUserCart = async (userId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart || cart.packages.length === 0) {
    return {
      cartCount: 0,
      cartList: [],
      summary: {
        subTotal: "0.00",
        discountAmt: "0.00",
        grandTotal: "0.00",
        grandTotalCoordinator: "0.00"
      }
    };
  }

  const cartList = cart.packages.map(item => ({
    cart_id: cart._id,
    package_id: item.packageId,
    name: item.name,
    platform: item.platform,
    medium: item.medium,
    image: item.image,
    finalPrice: item.finalPrice,
    quantity: item.quantity,
    totalPrice: item.totalPrice,
    discountPrice: item.discountPrice, 

  }));

  const summary = calculateSummary(cart.packages);

  return {
    message: "Success",
    cartCount: cartList.length,
    cartList,
    summary,
  };
};

// Remove one package from cart
const removeFromCart = async (userId, packageId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error('Cart not found');

  cart.packages = cart.packages.filter(item => !item.packageId.equals(packageId));

  if (cart.packages.length === 0) {
    await Cart.deleteOne({ userId });
    return null;
  }

  cart.summary = calculateSummary(cart.packages);
  await cart.save();

  const cartList = cart.packages.map(item => ({
    cart_id: cart._id,
    package_id: item.packageId,
    name: item.name,
    platform: item.platform,
    medium: item.medium,
    image: item.image,
    finalPrice: item.finalPrice,
    quantity: item.quantity,
    discountPrice: item.discountPrice, 

    totalPrice: item.totalPrice,
  }));

  return {
    cartCount: cartList.length,
    cartList,
    summary: cart.summary,
  };
};

// Remove multiple packages
const removeMultipleFromCart = async (userId, packageIds) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error('Cart not found');

  cart.packages = cart.packages.filter(pkg => !packageIds.includes(pkg.packageId.toString()));

  if (cart.packages.length === 0) {
    await Cart.deleteOne({ userId });
    return null;
  }

  cart.summary = calculateSummary(cart.packages);
  await cart.save();

  const cartList = cart.packages.map(item => ({
    cart_id: cart._id,
    package_id: item.packageId,
    name: item.name,
    platform: item.platform,
    medium: item.medium,
    image: item.image,
    finalPrice: item.finalPrice,
    quantity: item.quantity,
    totalPrice: item.totalPrice,
    discountPrice: item.discountPrice, 
  }));

  return {
    cartCount: cartList.length,
    cartList,
    summary: cart.summary,
  };
};

// Get cart item count
const getCartItemCount = async (userId) => {
  const cart = await Cart.findOne({ userId });
  return cart ? cart.packages.length : 0;
};

module.exports = {
  addToCart,
  getUserCart,
  removeFromCart,
  removeMultipleFromCart,
  getCartItemCount,
};
