const blogCategoryService = require("../service/blogCategoryService");

 exports.addOrUpdateBlogCategory = async (req, res) => {
  try {
    let { categoryId, id, categoryName, isActive } = req.body;

    // Use either categoryId or id
    categoryId = categoryId || id;

    // Convert "true"/"false" string to boolean
    if (typeof isActive === "string") {
      isActive = isActive.toLowerCase() === "true";
    }

    // If empty string or undefined, treat as null
    const finalCategoryId = categoryId && categoryId.trim() !== "" ? categoryId.trim() : null;

    const result = await blogCategoryService.addOrUpdateBlogCategory({
      categoryId: finalCategoryId,
      categoryName,
      isActive,
    });

    const message = result.action === "updated"
      ? "Blog category updated successfully"
      : "Blog category created successfully";

    return res.status(result.action === "updated" ? 200 : 201).json({
      message,
      data: result.data,
    });
  } catch (error) {
    console.error("Error in addOrUpdateBlogCategory:", error);
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const { search, limit, offset } = req.query;

    const result = await blogCategoryService.getAllCategories({
      search,
      limit,
      offset,
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ➤ Activate/Deactivate Category
exports.toggleStatus = async (req, res) => {
  try {
    let { isActive } = req.body;
    if (typeof isActive === 'string') {
      isActive = isActive.toLowerCase() === "true";
    }

    const result = await blogCategoryService.toggleCategoryStatus(req.params.id, isActive);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//  Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    let { ids } = req.body;

    // If only one ID is passed directly as string
    if (typeof ids === "string") {
      ids = [ids];
    }

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No category IDs provided" });
    }

    const result = await blogCategoryService.deleteCategories(ids);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

