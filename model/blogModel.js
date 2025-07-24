const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  SelectCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BlogCategory",
    required: true,
  },
  AuthorName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },
  Date: {
    type: Date,
    required: true,
  },
  BlogTitle: {
    type: String,
    required: true,
    unique: true, // prevent duplicate blogs by title
  },
  BriefIntro: {
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
  Details: {
    type: String,
    required: true,
  },
  isActive: {
  type: Boolean,
  default: true,
},
}, { timestamps: true }); 

module.exports = mongoose.model("Blog", blogSchema) ;
