const ClassMaster = require('../model/classMasterModel');

// Create class
exports.createClass = async (req, res) => {
  try {
    const { class: className, classEndDate } = req.body;
    const newClass = await ClassMaster.create({ class: className, classEndDate });
    res.status(201).json({ message: 'Class created successfully', data: newClass });
  } catch (error) {
    res.status(500).json({ message: 'Error creating class', error: error.message });
  }
};

// Get all active classes
exports.getActiveClasses = async (req, res) => {
  try {
    const classes = await ClassMaster.find();
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classes', error: error.message });
  }
};

// Get single class by ID
exports.getClassById = async (req, res) => {
  try {
    const classData = await ClassMaster.findById(req.params.id);
    if (!classData) return res.status(404).json({ message: 'Class not found' });
    res.status(200).json(classData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching class', error: error.message });
  }
};

// Update class
exports.updateClass = async (req, res) => {
  try {
    const updatedClass = await ClassMaster.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedClass) return res.status(404).json({ message: 'Class not found' });
    res.status(200).json({ message: 'Class updated', data: updatedClass });
  } catch (error) {
    res.status(500).json({ message: 'Error updating class', error: error.message });
  }
};

// Delete class
exports.deleteClass = async (req, res) => {
  try {
    // console.log("Deleting class:", req.params.id);
    const deleted = await ClassMaster.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Class not found' });
    res.status(200).json({ message: 'Class deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting class', error: error.message });
  }
};

// Toggle active/inactive
exports.toggleActive = async (req, res) => {
  try {
    const classData = await ClassMaster.findById(req.params.id);
    if (!classData) return res.status(404).json({ message: 'Class not found' });
    classData.isActive = !classData.isActive;
    await classData.save();
    res.status(200).json({ message: `Class is now ${classData.isActive ? 'Active' : 'Inactive'}` });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling class status', error: error.message });
  }
};
