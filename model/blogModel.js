const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BlogCategory",
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author", // or your User model
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  featuredImage: {
    type: String,
    required: true,
  },
  mainImage: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);
