
const Topic = require('../model/Topic');
const sanitizeHtml = require('sanitize-html');

exports.addOrUpdateTopic = async (req, res) => {
  try {
    const { topicId, moduleId, topicName, details, youtubeLink } = req.body;

    if (!moduleId || !topicName || !details) {
      return res.status(400).json({ message: "Module ID, Topic Name, and Details are required" });
    }

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

    let fileUrls = [];
    if (req.files && req.files.length > 0) {
      fileUrls = req.files.map(file => `/uploads/${file.filename}`);
    }

    const youtubeLinks = Array.isArray(youtubeLink)
      ? youtubeLink
      : youtubeLink
      ? [youtubeLink]
      : [];

    if (topicId) {
      const existing = await Topic.findById(topicId);
      if (!existing) {
        return res.status(404).json({ message: "Topic not found" });
      }

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
      existing.youtubeLink = youtubeLinks;
      if (fileUrls.length > 0) {
        existing.fileUrl = fileUrls;
      }

      await existing.save();
      return res.status(200).json({ message: "Topic updated successfully", data: existing });

    } else {
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
        fileUrl: fileUrls,
        youtubeLink: youtubeLinks
      });

      return res.status(201).json({ message: "Topic added successfully", data: newTopic });
    }
  } catch (error) {
    console.error("Error in addOrUpdateTopic:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteTopic = async (req, res) => {
  try {
    const { topicIds } = req.body;

    if (!topicIds || !Array.isArray(topicIds) || topicIds.length === 0) {
      return res.status(400).json({ message: "Please provide topicIds as a non-empty array" });
    }

    const result = await Topic.deleteOne({ _id: { $in: topicIds } });

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
    const { moduleId } = req.params;

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
