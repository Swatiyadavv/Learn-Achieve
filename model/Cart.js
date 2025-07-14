const mongoose = require("mongoose");

const cartPackageSchema = new mongoose.Schema({
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
    required: true,
  },
  name: [String],
  platform: String,
  medium: String,
  image: String,
  finalPrice: Number,
  actualPrice: Number, 
  discountPrice: Number,
  quantity: {
    type: Number,
    default: 1,
  },
  totalPrice: Number,
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const summarySchema = new mongoose.Schema({
  subTotal: { type: String, default: "0.00" },
  discountAmt: { type: String, default: "0.00" },
  grandTotal: { type: String, default: "0.00" },
  grandTotalCoordinator: { type: String, default: "0.00" },
}, { _id: false });

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    packages: [cartPackageSchema],
    summary: summarySchema
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
