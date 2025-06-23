const ClassMaster = require('../model/classMasterModel');

//  Create class
exports.createClass = async (req, res) => {
  try {
    const { class: className, classEndDate, isActive } = req.body; //
    const newClass = await ClassMaster.create({
      class: className,
      classEndDate,
      isActive: isActive !== undefined ? isActive : true // fallback to true if undefined
    });
    res.status(201).json({ message: 'Class created successfully', data: newClass });
  } catch (error) {
    res.status(500).json({ message: 'Error creating class', error: error.message });
  }
};

//  Get all active classes with pagination
exports.getPaginatedActiveClasses = async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const filter = { isActive: true };

    const classes = await ClassMaster.find(filter)
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await ClassMaster.countDocuments(filter);

    res.status(200).json({
      total,
      count: classes.length,
      offset,
      limit,
      data: classes,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classes', error: error.message });
  }
};

//  Get all classes (active + inactive)
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await ClassMaster.find().sort({ createdAt: -1 }); // No filter
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all classes', error: error.message });
  }
};


// Get all active classes with search query
exports.getActiveClassesWithSearch = async (req, res) => {
  try {
    const searchQuery = req.query.search || '';
    const filter = {
      class: { $regex: searchQuery, $options: 'i' }, // case-insensitive partial match
      isActive: true,
    };

    const classes = await ClassMaster.find(filter).sort({ createdAt: -1 });
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classes', error: error.message });
  }
};

//  Get single class by ID
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

//  Delete class
exports.deleteClass = async (req, res) => {
  try {
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
