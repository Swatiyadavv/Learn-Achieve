const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    packageName: {
      type: String,
      required: true,
      trim: true,
    },
    className: {
      type: String,
      required: true,
      trim: true,
      enum: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'], // Example options
    },
    medium: {
      type: String,
      required: true,
      enum: ['Hindi', 'English'],
    },
    mockTests: {
      type: [String], // array of mock test names or IDs
      required: true,
      validate: v => Array.isArray(v) && v.length > 0,
    },
    numberOfAttempts: {
      type: Number,
      required: true,
      min: 1,
    },
    platform: {
      type: String,
      required: true,
      enum: ['Bharat-Sat', 'ExamYa', 'Pradnya', 'Learntic'],
    },
    actualPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    finalPrice: {
      type: Number,
      min: 0,
    },
    validityInDays: {
      type: Number,
      required: true,
      min: 1,
    },
    image: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// calculate finalPrice before saving
packageSchema.pre('save', function (next) {
  this.finalPrice = this.actualPrice - this.discountPrice;
  next();
});

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;
