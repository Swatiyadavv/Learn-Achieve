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
    // Escape special regex characters for safety
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Match anywhere in BlogTitle, BriefIntro, or AuthorName
    query.$or = [
      { BlogTitle: { $regex: escapedSearch, $options: "i" } },
      { BriefIntro: { $regex: escapedSearch, $options: "i" } },
      { AuthorName: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  const blogs = await Blog.find(query)
    .sort({ createdAt: -1 }) // latest first
    .skip(offset)
    .limit(limit);

  const total = await Blog.countDocuments(query); // for pagination

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
  return await Blog.deleteMany({ _id: { $in: ids } });
};
