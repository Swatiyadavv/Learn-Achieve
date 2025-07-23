// const ejs = require('ejs');
// const pdf = require('html-pdf');
// const path = require('path');
// const Order = require('../model/Order');
// const Package = require('../model/Package');

// exports.generateInvoice = async (req, res) => {
//   try {
  
//     const { orderId } = req.params;         

//     if (!orderId) {
//       return res.status(400).json({ message: 'Missing orderId (URL param)' });
//     }


//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     const cartList = [];
//     for (const item of order.packages) {
//       const pkg = await Package.findById(item.packageId);
//       const originalPrice = item.originalPrice || pkg?.actualPrice || 0;
//       const discount = originalPrice - item.priceAtOrder;

//       cartList.push({
//         package_id: item.packageId,
//         name: pkg?.packageName || [],
//         platform: pkg?.platform || '',
//         medium: pkg?.medium || '',
//         image: pkg?.image || '',
//         originalPrice,
//         discountAtOrder: discount,
//         finalPrice: item.priceAtOrder,
//         quantity: item.quantity,
//         totalPrice: item.quantity * item.priceAtOrder,
//       });
//     }

//     const originalTotal = cartList.reduce(
//       (sum, i) => sum + i.originalPrice * i.quantity,
//       0
//     );
//     const totalDiscount = originalTotal - order.totalAmount;

//     const summary = {
//       originalTotal: originalTotal.toFixed(2),
//       discountAmt: totalDiscount.toFixed(2),
//       grandTotal: order.totalAmount.toFixed(2),
//       grandTotalCoordinator: order.totalAmount.toFixed(2),
//     };

//     const filePath = path.join(__dirname, '../templates/invoice.ejs');

//     ejs.renderFile(
//       filePath,
//       {
//         cartList,
//         summary,
//         orderId: order._id,
//         orderDate: order.orderedAt,
//       },
//       (err, html) => {
//         if (err) {
//           console.error('Template rendering error:', err);
//           return res.status(500).send('Template rendering failed');
//         }

//         pdf.create(html).toStream((err, stream) => {
//           if (err) {
//             console.error('PDF creation error:', err);
//             return res.status(500).send('PDF creation failed');
//           }

//           res.setHeader('Content-Type', 'application/pdf');
//           stream.pipe(res);
//         });
//       }
//     );
//   } catch (error) {
//     console.error('Invoice generation error:', error);
//     res.status(500).json({ error: error.message });
//   }
// };
const ejs = require('ejs');
const pdf = require('html-pdf');
const path = require('path');
const Order = require('../model/Order');
const Package = require('../model/Package');

exports.generateInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ message: 'Missing orderId (URL param)' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const cartList = [];
    for (const item of order.packages) {
      const pkg = await Package.findById(item.packageId);
      const originalPrice = item.originalPrice || pkg?.actualPrice || 0;
      const discount = originalPrice - item.priceAtOrder;

      cartList.push({
        package_id: item.packageId,
        name: pkg?.packageName || [],
        platform: pkg?.platform || '',
        medium: pkg?.medium || '',
        image: pkg?.image || '',
        originalPrice,
        discountAtOrder: discount,
        finalPrice: item.priceAtOrder,
        quantity: item.quantity,
        totalPrice: item.quantity * item.priceAtOrder,
      });
    }

    const originalTotal = cartList.reduce(
      (sum, i) => sum + i.originalPrice * i.quantity,
      0
    );
    const totalDiscount = originalTotal - order.totalAmount;

    const summary = {
      originalTotal: originalTotal.toFixed(2),
      discountAmt: totalDiscount.toFixed(2),
      grandTotal: order.totalAmount.toFixed(2),
      grandTotalCoordinator: order.totalAmount.toFixed(2),
    };

    const filePath = path.join(__dirname, '../templates/invoice.ejs');
    
    ejs.renderFile(
      filePath,
      {
        cartList,
        summary,
        orderId: order._id,
        orderDate: order.orderedAt,
      },
      (err, html) => {
        if (err) {
          console.error('Template rendering error:', err);
          return res.status(500).send('Template rendering failed');
        }

        pdf.create(html).toStream((err, stream) => {
          if (err) {
            console.error('PDF creation error:', err);
            return res.status(500).send('PDF creation failed');
          }

          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'inline; filename=invoice.pdf'); //  Add this line
          stream.pipe(res);
        });
      }
    );
  } catch (error) {
    console.error('Invoice generation error:', error);
    res.status(500).json({ error: error.message });
  }
};
