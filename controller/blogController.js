const blogService = require("../service/blogService");
const sanitizeHtml = require("sanitize-html");

const convertToHTML = require("../utils/textToHTML");

exports.addOrUpdateBlog = async (req, res) => {
  try {
    const {
      id,
      SelectCategory,
      AuthorName,
      BlogTitle,
      BriefIntro,
      Details,
      Date,
    } = req.body;

    if (!SelectCategory || !AuthorName || !BlogTitle || !BriefIntro || !Details || !Date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Convert plain text to HTML first
    const htmlDetails = convertToHTML(Details);

    // ✅ Then sanitize that HTML
    const safeDetails = sanitizeHtml(htmlDetails, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "img", "video", "iframe", "span", "h1", "h2", "h3", "u", "b", "i", "p", "br"
      ]),
      allowedAttributes: {
        '*': ['style', 'class', 'src', 'href', 'alt', 'frameborder',
          'allow', 'allowfullscreen', 'width', 'height']
      },
      disallowedTagsMode: 'discard'
    });

    // ✅ Handle images if uploaded
    let featuredImage, mainImage;
    if (req.files?.featuredImage) {
      featuredImage = req.files.featuredImage[0].filename;
    }
    if (req.files?.mainImage) {
      mainImage = req.files.mainImage[0].filename;
    }

    const blogData = {
      SelectCategory,
      AuthorName,
      BlogTitle,
      BriefIntro,
      Details: safeDetails,
      Date,
    };

    if (featuredImage) blogData.featuredImage = featuredImage;
    if (mainImage) blogData.mainImage = mainImage;

    let blog;

    // ✅ UPDATE existing blog
    if (id) {
      blog = await blogService.updateBlog(id, blogData);
      if (!blog) return res.status(404).json({ message: "Blog not found" });

      return res.status(200).json({
        message: "Blog updated successfully",
        data: blog,
      });
    }

    // ✅ CREATE new blog
    if (!featuredImage || !mainImage) {
      return res.status(400).json({ message: "Both images are required for new blog" });
    }

    blog = await blogService.createBlog({
      ...blogData,
      featuredImage,
      mainImage,
    });

    return res.status(201).json({
      message: "Blog created successfully",
      data: blog,
    });

  } catch (err) {
    console.error("💥 Blog Add/Update Error:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const { search = "", limit = 10, offset = 0 } = req.query;

    const { blogs, total } = await blogService.getAllBlogs({
      search,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      message: "Blogs fetched successfully",
      total,
      data: blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Server error" });
  }
};



exports.toggleBlogStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const isActiveValue = req.body.isActive;

    const isActive =
      isActiveValue === true ||
      isActiveValue === "true" ||
      isActiveValue === 1 ||
      isActiveValue === "1";

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "Invalid isActive value" });
    }

    const blog = await blogService.updateBlog(id, { isActive });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      message: `Blog marked as ${isActive ? "Active" : "Inactive"} successfully`,
      data: blog,
    });
  } catch (error) {
    console.error("Toggle blog status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id, ids } = req.body;

    if (id) {
      // Single Delete
      const deleted = await blogService.deleteBlogById(id);
      if (!deleted) {
        return res.status(404).json({ message: "Blog not found" });
      }
      return res.status(200).json({ message: "Blog deleted successfully" });
    }

    if (Array.isArray(ids) && ids.length > 0) {
      // Multiple Delete
      const result = await blogService.deleteMultipleBlogs(ids);
      return res.status(200).json({
        message: `${result.deletedCount} blogs deleted successfully`,
      });
    }

    return res.status(400).json({
      message: "Please provide either `id` (string) or `ids` (array of strings)",
    });

  } catch (error) {
    console.error(" Delete Blog Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
