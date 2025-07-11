const Blog = require("../model/blogModel");

exports.createBlog = async (blogData) => {
  const blog = new Blog(blogData);
  return await blog.save();
};
