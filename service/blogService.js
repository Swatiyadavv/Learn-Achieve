const Blog = require("../model/blogModel");

exports.createBlog = async (data) => {
  const blog = new Blog(data);
  return await blog.save();
};

exports.updateBlog = async (id, data) => {
  return await Blog.findByIdAndUpdate(id, data, { new: true });
};


exports.getAllBlogs = async ({ search, limit, offset }) => {
  const query = {};

  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    query.$or = [
      { BlogTitle: { $regex: escapedSearch, $options: "i" } },
      { BriefIntro: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  const blogs = await Blog.find(query)
    .populate("AuthorName", "name -_id") // only name, hide _id
    // .populate("SelectCategory",) 
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  const total = await Blog.countDocuments(query);

  return { blogs, total };
};




exports.toggleBlogStatus = async (id, isActive) => {
  return await Blog.findByIdAndUpdate(
    id,
    { isActive },
    { new: true } // Return updated blog
  );
};

exports.deleteBlogById = async (id) => {
  return await Blog.findByIdAndDelete(id);
};

exports.deleteMultipleBlogs = async (ids) => {
  return await Blog.deleteMany({ _id: { $in: ids } 
  });
};
// service/blogService.js

exports.getBlogsByCategory = async (categoryId) => {
  return await Blog.find({ SelectCategory: categoryId, isActive: true }) // optional: filter only active blogs
    .populate("AuthorName", "name -_id")
    .populate("SelectCategory", "name -_id") // if category name is needed
    .sort({ createdAt: -1 });
};



