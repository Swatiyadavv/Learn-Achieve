// controller/AddAuthorController.js
const { addAuthorService } = require('../service/AddAuthorService');

exports.addAuthor = async (req, res) => {
  try {
    const newAuthor = await addAuthorService({
      name: req.body.name,
      briefIntro: req.body.briefIntro,
      file: req.file,
      req: req
    });

    res.status(201).json({
      message: "Author added successfully",
      author: newAuthor
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
