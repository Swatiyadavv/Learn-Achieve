// services/AddAuthorService.js
const Author = require('../model/AddAuthorModel');

exports.addAuthorService = async ({ _id, name, briefIntro, file }) => {
  const trimmedName = name?.trim();
  const trimmedIntro = briefIntro?.trim();

  let imageUrl;
  if (file) {
    imageUrl = file.filename;
  }

  if (_id) {
    console.log("UPDATE FLOW: Received ID:", _id);
    const author = await Author.findById(_id);
    if (!author) throw new Error("Author not found for update");

    if (trimmedName) author.name = trimmedName;
    if (trimmedIntro) author.briefIntro = trimmedIntro;
    if (imageUrl) author.image = imageUrl;

    await author.save();

    return {
      message: "Author updated successfully",
      author,
    };
  } else {
    console.log("ADD FLOW");

    const existingAuthor = await Author.findOne({ name: trimmedName });
    if (existingAuthor) throw new Error("Author already exists");

    const newAuthor = new Author({
      name: trimmedName,
      briefIntro: trimmedIntro,
      image: imageUrl,
    });

    await newAuthor.save();

    return {
      message: "Author added successfully",
      author: newAuthor,
    };
  }
};
// exports.getAllAuthorsService = async () => {
//   const authors = await Author.find().sort({ createdAt: -1 });
//   return authors;
// };


exports.getAllAuthorsService = async ({ name = "", limit = 10, offset = 0 }) => {
  const searchQuery = {
    name: { $regex: name, $options: 'i' } // Case-insensitive partial match
  };

  const authors = await Author.find(searchQuery)
    .skip(parseInt(offset))
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const totalCount = await Author.countDocuments(searchQuery);

  return {
    message: "Authors fetched successfully",
    totalCount,
    count: authors.length,
    authors,
  };
};

exports.deleteAuthorService = async (id) => {
  if (!id) {
    throw new Error("Author ID is required");
  }

  // Single delete
  if (typeof id === 'string') {
    const deleted = await Author.findByIdAndDelete(id);
    if (!deleted) {
      throw new Error("Author not found");
    }
    return { message: "Author deleted successfully", deleted };
  }

  // Multiple delete
  if (Array.isArray(id)) {
    const result = await Author.deleteMany({ _id: { $in: id } });
    return { message: `${result.deletedCount} authors deleted successfully` };
  }

  throw new Error("Invalid ID format");
};
exports.toggleAuthorStatusService = async (_id, isActive) => {
  if (!_id || typeof isActive !== 'boolean') {
    throw new Error("ID and isActive (true/false) are required");
  }

  const author = await Author.findById(_id);
  if (!author) {
    throw new Error("Author not found");
  }

  author.isActive = isActive;
  await author.save();

  return {
    message: `Author ${isActive ? 'activated' : 'deactivated'} successfully`,
    author
  };
};
