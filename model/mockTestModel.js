// const mongoose = require("mongoose");
// const mockTestSchema = new mongoose.Schema({
//   mockTestName: {
//     type: String,
//     required: [true, "Mock Test name is required"],
//     trim: true
//   },
//   medium: {
//     type: [String],
//     required: [true, "At least one medium is required"],
//     enum: {
//       values: ["Hindi", "English", "Semi-English", "Marathi"],
//       message: "Invalid medium option"
//     }
//   },
//   class: {
//     type: [mongoose.Schema.Types.ObjectId],
//     ref: "ClassMaster",
//     required: [true, "At least one class is required"]
//   },
//   duration: {
//     type: Number,
//     required: [true, "Duration is required"],
//     min: [30, "Duration must be at least 1 minute"]
//   },
//  subjects: {
//     type: [mongoose.Schema.Types.ObjectId],
//     ref: "Subject",
//     required: [true, "At least one subject is required"]
//   },
//  totalQuestions: {
//     type: Number,
//     required: [true, "Total number of questions is required"],
//     min: [15, "Total questions must be greater than 0"]
//   },

//   status: {
//     type: String,
//     enum: ["active", "inactive"],
//     default: "active"
//   }
// }, { timestamps: true });
// const MockTest = mongoose.model("MockTest", mockTestSchema);
// module.exports = MockTest;
const mongoose = require("mongoose");

// ✅ STEP 1: Schema definition
const mockTestSchema = new mongoose.Schema({
  mockTestName: {
    type: String,
    required: [true, "Mock Test name is required"],
    trim: true
  },
  medium: {
    type: [String],
    required: [true, "At least one medium is required"],
    enum: {
      values: ["Hindi", "English", "Semi-English", "Marathi"],
      message: "Invalid medium option"
    }
  },
  class: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "ClassMaster",
    required: [true, "At least one class is required"]
  },
  duration: {
    type: Number,
    required: [true, "Duration is required"],
    min: [30, "Duration must be at least 1 minute"]
  },
  subjects: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Subject",
    required: [true, "At least one subject is required"]
  },
  totalQuestions: {
    type: Number,
    required: [true, "Total number of questions is required"],
    min: [15, "Total questions must be greater than 0"]
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }
}, {
  timestamps: true,

  // ✅ STEP 2: Enable virtuals in JSON output
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


// ✅ STEP 3: Virtual field for "questions"
mockTestSchema.virtual('questions', {
  ref: 'QuestionBank',         // Model name for questions
  localField: '_id',           // This model’s field
  foreignField: 'mockTest'     // Field in Question model
});


// ✅ STEP 4: Export
const MockTest = mongoose.model("MockTest", mockTestSchema);
module.exports = MockTest;
