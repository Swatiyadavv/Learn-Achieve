const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html'); 

const topicSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true,
  },
  topicName: {
    type: String,
    required: true,
    match: [/^[a-zA-Z0-9\s]+$/, "Only alphanumeric and spaces allowed"],
  },
details: {
  type: String,
  set: (value) =>
    sanitizeHtml(value, {
      allowedTags: false, //  all HTML tags
      allowedAttributes: false, //  all attributes
      allowedSchemes: ['http', 'https', 'data'],
      disallowedTagsMode: 'discard',
    })
},
  fileUrl: {
    type: String,
    validate: {
      validator: function (v) {
        return !v || /\.(pdf|doc|docx|ppt|pptx)$/i.test(v);
      },
      message: "Only PDF, DOC, DOCX, PPT, or PPTX files are allowed"
    }
  },
  youtubeLink: {
    type: String,
    validate: {
      validator: function (v) {
        return !v || /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(v);
      },
      message: 'Invalid YouTube link'
    }
  }
}, { timestamps: true });

// Unique constraint manually for (moduleId + topicName)
topicSchema.index({ moduleId: 1, topicName: 1 }, { unique: true });

module.exports = mongoose.model('Topic', topicSchema);
