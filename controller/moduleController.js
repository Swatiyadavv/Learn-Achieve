const Module = require('../model/Module');
exports.addOrUpdateModule = async (req, res) => {
  try {
    const { id, name, studyMaterialId } = req.body;

    if (!name || !studyMaterialId) {
      return res.status(400).json({ message: "Name and studyMaterialId are required" });
    }

    if (id) {
      // Check if duplicate name exists for same study material but different ID
      const duplicate = await Module.findOne({
        _id: { $ne: id },
        name,
        studyMaterialId,
      });

      if (duplicate) {
        return res.status(400).json({ message: "Module with this name already exists for this study material" });
      }

      // Update
      const updated = await Module.findByIdAndUpdate(id, { name }, { new: true });
      if (!updated) return res.status(404).json({ message: "Module not found" });
      return res.status(200).json({ message: "Module updated successfully", data: updated });

    } else {
      // Check if already exists
      const exists = await Module.findOne({ name, studyMaterialId });
      if (exists) {
        return res.status(400).json({ message: "Module with this name already exists for this study material" });
      }

      // Create
      const newModule = await Module.create({ name, studyMaterialId });
      return res.status(201).json({ message: "Module added successfully", data: newModule });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// Get all modules by StudyMaterial
exports.getModulesByMaterial = async (req, res) => {
  try {
    const { studyMaterialId } = req.params;
    const modules = await Module.find({ studyMaterialId });
    res.status(200).json({ data: modules });
  } catch (err) {
    res.status(500).json({ message: "Error fetching modules" });
  }
};

//  Delete single or multiple modules
exports.deleteModules = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "Please provide module IDs in array" });
    }

    const result = await Module.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: `${result.deletedCount} module(s) deleted.` });
  } catch (err) {
    res.status(500).json({ message: "Error deleting modules" });
  }
};
