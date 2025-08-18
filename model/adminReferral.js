const mongoose = require('mongoose');

const adminReferralSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['flat', 'percent'], required: true },
  discountValue: { type: Number, required: true }, // ₹500 or 10%
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('AdminReferral', adminReferralSchema);
