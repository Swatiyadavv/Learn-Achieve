const Cart = require('../model/Cart');
const Package = require('../model/Package');


const addToCart = async (userId, packageId) => {
  const pkg = await Package.findById(packageId);
  if (!pkg) throw new Error('Package not found');

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, packages: [] });
  }


  const existingItem = cart.packages.find(p => p.packageId.equals(packageId));
  if (existingItem) {
    throw new Error('Package already in cart');
  }

  cart.packages.push({ packageId, quantity: 1 });

  await cart.save();
  return cart;
};



// const getUserCart = async (userId) => {
//   const cart = await Cart.findOne({ userId }).populate('packages.packageId');
//   if (!cart) return [];

//   const detailedPackages = cart.packages.map(item => {
//     const pkg = item.packageId;
//     return {
//       packageId: pkg._id,
//       name: pkg.name,
//       finalPrice: pkg.finalPrice,
//       quantity: item.quantity,
//       totalPrice: item.quantity * pkg.finalPrice
//     };
//   });

//   return detailedPackages;
// };

const getUserCart = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate('packages.packageId');

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

  const cartList = cart.packages
    .filter(item => item.packageId) 
    .map(item => {
      const pkg = item.packageId;

      const quantity = item.quantity || 1;
      const finalPrice = pkg.finalPrice || 0;
      const totalPrice = quantity * finalPrice;

      return {
        cart_id: cart._id,
        package_id: pkg._id,
        name: pkg.packageName,
        platform: pkg.platform,
        medium: pkg.medium,
         image: pkg.image,
        finalPrice,
        quantity,
        totalPrice
      };
    });

  const subTotal = cartList.reduce((sum, item) => sum + item.totalPrice, 0);
  const discountAmt = cart.packages
    .filter(item => item.packageId)
    .reduce((sum, item) => sum + (item.packageId.discountPrice || 0), 0);

  const grandTotal = subTotal;
  const grandTotalCoordinator = subTotal - discountAmt;

  return {
    cartCount: cartList.length,
    cartList,
    summary: {
      subTotal: subTotal.toFixed(2),
      discountAmt: discountAmt.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      grandTotalCoordinator: grandTotalCoordinator.toFixed(2)
    }
  };
};

const removeFromCart = async (userId, packageId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error('Cart not found');

  const index = cart.packages.findIndex(p => p.packageId.equals(packageId));
  if (index === -1) throw new Error('Package not in cart');

  if (cart.packages[index].quantity > 1) {
    cart.packages[index].quantity -= 1;
    await cart.save();
    return cart;
  } else {
    cart.packages.splice(index, 1);

    if (cart.packages.length === 0) {
      await Cart.deleteOne({ _id: cart._id });
      return null;
    } else {
      await cart.save();
      return cart;
    }
  }
};


const removeMultipleFromCart = async (userId, packageIds) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error('Cart not found');

  cart.packages = cart.packages.filter(
    item => !packageIds.some(id => item.packageId.equals(id))
  );

  await cart.save();
  return cart;
};

const getCartItemCount = async (userId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) return 0;

  let totalQuantity = 0;
  for (const item of cart.packages) {
    totalQuantity += item.quantity || 1;
  }

  return totalQuantity;
};

module.exports = {
  addToCart,
  getUserCart,
  removeFromCart,
  removeMultipleFromCart,
  getCartItemCount
};
