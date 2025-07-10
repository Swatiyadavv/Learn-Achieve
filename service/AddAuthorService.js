// services/AddAuthorService.js
const Author = require('../model/AddAuthorModel');

exports.addAuthorService = async ({ name, briefIntro, file, req }) => {
  const trimmedName = name.trim();

  const existingAuthor = await Author.findOne({ name: trimmedName });
  if (existingAuthor) throw new Error("Author already exists");

  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/author/${file.filename}`;

  const newAuthor = new Author({
    name: trimmedName,
    briefIntro: briefIntro?.trim(), // ✅ add this
    image: imageUrl
  });

  await newAuthor.save();
  return newAuthor;
};

