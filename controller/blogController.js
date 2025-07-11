const blogService = require("../service/blogService");
const Blog = require('../model/blogModel')
exports.addBlog = async (req, res) => {
  try {
    const { category, author, title, description } = req.body;

    if (!category || !author || !title || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.files || !req.files.featuredImage || !req.files.mainImage) {
      return res.status(400).json({ message: "Both images are required" });
    }

    const featuredImage = req.files.featuredImage[0].filename;
    const mainImage = req.files.mainImage[0].filename;

    const blog = await Blog.create({
      category,
      author,
      title,
      description,
      featuredImage,
      mainImage,
    });

    res.status(201).json({ message: "Blog created successfully", data: blog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

