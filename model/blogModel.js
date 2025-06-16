const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  category: { type: String, required: true },
  authorName: { type: String, required: true },
  date: { type: Date, required: true },
  title: { type: String, required: true },
  featuredImage: { type: String, required: true },
  mainImage: { type: String, required: true },
  briefIntro: { type: String },
  details: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
