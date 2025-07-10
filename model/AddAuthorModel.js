const mongoose = require('mongoose');

const urlValidator = {
  validator: function (v) {
    return /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/.test(v);
  },
  message: props => `${props.value} is not a valid URL`
};

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  briefIntro: { type: String, required: true },
  image: { type: String, required: true }, // filename only
    isActive: {
    type: Boolean,
    default: true 
  },

  facebook: { type: String, validate: urlValidator },
  instagram: { type: String, validate: urlValidator },
  linkedin: { type: String, validate: urlValidator },
  youtube: { type: String, validate: urlValidator },
  twitter: { type: String, validate: urlValidator }

}, { timestamps: true });

module.exports = mongoose.model('Author', authorSchema);
