// model/authorModel.js
const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true ,unique:true},
  briefIntro: { type: String, required: true },
  image: { type: String, required: true }, // filename or full path
  facebook: { type: String },
  instagram: { type: String },
  linkedin: { type: String },
  youtube: { type: String },
  twitter: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Author', authorSchema);
