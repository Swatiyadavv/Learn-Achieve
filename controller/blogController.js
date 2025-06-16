const blogService = require('../service/blogService');

exports.addBlog = async (req, res) => {
  try {
    const {
      category, authorName, date, title, briefIntro, details
    } = req.body;

    const featuredImage = req.files?.featuredImage?.[0]?.filename;
    const mainImage = req.files?.mainImage?.[0]?.filename;

    if (!featuredImage || !mainImage) {
      return res.status(400).json({ message: 'Images are required' });
    }

    const blogData = {
      category,
      authorName,
      date,
      title,
      featuredImage,
      mainImage,
      briefIntro,
      details
    };

    const savedBlog = await blogService.createBlog(blogData);
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await blogService.getAllBlogs();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
