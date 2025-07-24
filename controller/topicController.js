const Topic = require('../model/Topic');
const sanitizeHtml = require('sanitize-html');

// Create or Update Topic
exports.addOrUpdateTopic = async (req, res) => {
  try {
    const { topicId, moduleId, topicName, details, youtubeLink } = req.body;
    let fileUrl = null;

    if (!moduleId || !topicName || !details) {
      return res.status(400).json({ message: "Module ID, Topic Name, and Details are required" });
    }

    // Clean and store HTML content safely
    const htmlDetails = sanitizeHtml(details, {
      allowedTags: [
        'p', 'b', 'i', 'em', 'strong', 'ul', 'ol', 'li', 'a', 'img', 'br',
        'h1', 'h2', 'h3', 'blockquote', 'pre', 'code', 'table', 'thead', 'tbody', 'tr', 'td', 'th'
      ],
      allowedAttributes: {
        a: ['href', 'target'],
        img: ['src', 'alt', 'title'],
        '*': ['style']
      },
      allowedSchemes: ['http', 'https', 'mailto']
    });

    // Handle file upload
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    if (topicId) {
      // UPDATE
      const existing = await Topic.findById(topicId);
      if (!existing) {
        return res.status(404).json({ message: "Topic not found" });
      }

      // Check for duplicate name under same module (excluding current topic)
      const duplicate = await Topic.findOne({
        _id: { $ne: topicId },
        moduleId,
        topicName: topicName.trim().toLowerCase()
      });
      if (duplicate) {
        return res.status(409).json({ message: "Another topic with this name already exists in this module" });
      }

      existing.topicName = topicName.trim().toLowerCase();
      existing.details = htmlDetails;
      existing.youtubeLink = youtubeLink;
      if (fileUrl) existing.fileUrl = fileUrl;

      await existing.save();

      return res.status(200).json({ message: "Topic updated successfully", data: existing });
    } else {
      //  CREATE
      const existing = await Topic.findOne({
        moduleId,
        topicName: topicName.trim().toLowerCase()
      });
      if (existing) {
        return res.status(409).json({ message: "Topic with same name already exists in this module" });
      }

      const newTopic = await Topic.create({
        moduleId,
        topicName: topicName.trim().toLowerCase(),
        details: htmlDetails,
        fileUrl,
        youtubeLink
      });

      return res.status(201).json({ message: "Topic added successfully", data: newTopic });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// controller/topicController.js
exports.deleteTopic = async (req, res) => {
  try {
    const { topicIds } = req.body;

    if (!topicIds || !Array.isArray(topicIds) || topicIds.length === 0) {
      return res.status(400).json({ message: "Please provide topicIds as a non-empty array" });
    }

    const result = await Topic.deleteMany({ _id: { $in: topicIds } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No topics found to delete" });
    }

    res.status(200).json({
      message: `Deleted ${result.deletedCount} topic(s) successfully`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getAllTopics = async (req, res) => {
  try {
    const { moduleId } = req.body;

    const filter = {};
    if (moduleId) {
      filter.moduleId = moduleId;
    }

    const topics = await Topic.find(filter).populate('moduleId', 'moduleName');

    res.status(200).json({
      message: "Topics fetched successfully",
      data: topics
    });
  } catch (error) {
    console.error("Error fetching topics:", error);
    res.status(500).json({ message: "Server error" });
  }
};
