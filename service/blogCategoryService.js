const BlogCategory = require("../model/blogCategoryModel");


 exports.addOrUpdateBlogCategory = async ({ categoryId, categoryName, isActive }) => {
  if (categoryId) {
    // Try to update existing category
    const updated = await BlogCategory.findByIdAndUpdate(
      categoryId,
      { categoryName, isActive },
      { new: true }
    );

    if (!updated) {
      throw new Error("No blog category found with the provided ID.");
    }

    return { action: "updated", data: updated };
  }

  // Create new category
  const created = await BlogCategory.create({
    categoryName,
    isActive,
  });

  return { action: "created", data: created };
};

exports.getAllCategories = async ({ search, limit, offset }) => {
  const filter = {};

  // If search query exists, use regex (case-insensitive)
  if (search) {
    filter.categoryName = { $regex: search, $options: "i" };
  }

  const query = BlogCategory.find(filter)
    .skip(parseInt(offset) || 0)
    .limit(parseInt(limit) || 0) // 0 means no limit

  const data = await query.exec();

  const total = await BlogCategory.countDocuments(filter);

  return {
    total,
    count: data.length,
    data,
  };
};


exports.toggleCategoryStatus = async (id, isActive) => {
  const category = await BlogCategory.findById(id);
  if (!category) throw new Error("Category not found");
  category.isActive = isActive;
  await category.save();
  return {
    message: `Category ${isActive ? "activated" : "deactivated"} successfully`,
    category
  };
};

exports.deleteCategories = async (ids) => {
  const result = await BlogCategory.deleteMany({ _id: { $in: ids } });

  if (result.deletedCount === 0) {
    throw new Error("No categories found or already deleted");
  }

  return {
    message: `${result.deletedCount} categor${result.deletedCount === 1 ? "y" : "ies"} deleted successfully`,
  };
};

