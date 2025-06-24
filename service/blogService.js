  const Blog = require('../model/blogModel');
exports.createBlog = async (data) => {
  const newBlog = new Blog(data);
  return await newBlog.save();
};

exports.getAllBlogs = async () => {
  return await Blog.find().sort({ createdAt: -1 });
};
