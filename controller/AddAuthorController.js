// controller/AddAuthorController.js
const { addAuthorService ,getAllAuthorsService,deleteAuthorService,
    toggleAuthorStatusService
 } = require('../service/AddAuthorService');

exports.addAuthor = async (req, res) => {
  try {
    const result = await addAuthorService({
      _id: req.body.id, // 👈 yeh important fix hai
      name: req.body.name,
      briefIntro: req.body.briefIntro,
      file: req.file,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// exports.getAllAuthors = async (req, res) => {
//   try {
//     const authors = await getAllAuthorsService();
//     res.status(200).json({
//       message: "Authors fetched successfully",
//       authors
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to fetch authors",
//       error: error.message
//     });
//   }
// };
exports.getAllAuthors = async (req, res) => {
  try {
    const { name = "", limit = 10, offset = 0 } = req.query;

    const result = await getAllAuthorsService({
      name,
      limit,
      offset
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch authors",
      error: error.message
    });
  }
};
exports. deleteAuthorController = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await deleteAuthorService(id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete author(s)", error: error.message });
  }
};
exports.toggleAuthorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let { isActive } = req.body;

    // Convert string "true"/"false" to actual boolean
    if (typeof isActive === 'string') {
      isActive = isActive.toLowerCase() === 'true';
    }

    if (!id || typeof isActive !== 'boolean') {
      return res.status(400).json({ message: "ID and isActive (true/false) are required" });
    }

    const result = await toggleAuthorStatusService(id, isActive);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};