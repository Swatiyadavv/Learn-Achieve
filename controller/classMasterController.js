const ClassMaster = require('../model/classMasterModel');

// Helper function to format classEndDate
const formatClassEndDate = (classes) => {
  return classes.map(cls => ({
    ...cls._doc,
    classEndDate: cls.classEndDate.toISOString().split('T')[0]
  }));
};

// Create class
exports.createClass = async (req, res) => {
  
  try {
    const { class: className, classEndDate, isActive } = req.body;
    const newClass = await ClassMaster.create({
      class: className,
      classEndDate,
      isActive: isActive !== undefined ? isActive : true
    });

    const formatted = {
      ...newClass._doc,
      classEndDate: newClass.classEndDate.toISOString().split('T')[0]
    };

    res.status(201).json({ message: 'Class created successfully', data: formatted });
  } catch (error) {
    res.status(500).json({ message: 'Error creating class', error: error.message });
  }
};

// Get all active classes with pagination
exports.getPaginatedActiveClasses = async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const filter = {
      isActive: true,
      class: { $regex: search, $options: 'i' }
    };

    const classes = await ClassMaster.find(filter)
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await ClassMaster.countDocuments(filter);

    const formatted = formatClassEndDate(classes);

    res.status(200).json({
      total,
      count: classes.length,
      offset,
      limit,
      data: formatted,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classes', error: error.message });
  }
};

// Get all classes (active + inactive) with pagination + search
exports.getAllClasses = async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const filter = {
      class: { $regex: search, $options: 'i' }
    };

    const classes = await ClassMaster.find(filter)
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await ClassMaster.countDocuments(filter);

    const formatted = formatClassEndDate(classes);

    res.status(200).json({
      total,
      count: classes.length,
      offset,
      limit,
      data: formatted,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all classes', error: error.message });
  }
};

// Get all active classes with search query (no pagination)
exports.getActiveClassesWithSearch = async (req, res) => {
  try {
    const searchQuery = req.query.search || '';
    const filter = {
      class: { $regex: searchQuery, $options: 'i' },
      isActive: true,
    };

    const classes = await ClassMaster.find(filter).sort({ createdAt: -1 });

    const formatted = formatClassEndDate(classes);

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classes', error: error.message });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const classData = await ClassMaster.findById(req.params.id);
    if (!classData) return res.status(404).json({ message: 'Class not found' });

    const formatted = {
      ...classData._doc,
      classEndDate: classData.classEndDate.toISOString().split('T')[0]
    };

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching class', error: error.message });
  }
};

// Update class
exports.updateClass = async (req, res) => {
  try {
    const updatedClass = await ClassMaster.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedClass) return res.status(404).json({ message: 'Class not found' });

    const formatted = {
      ...updatedClass._doc,
      classEndDate: updatedClass.classEndDate.toISOString().split('T')[0]
    };

    res.status(200).json({ message: 'Class updated', data: formatted });
  } catch (error) {
    res.status(500).json({ message: 'Error updating class', error: error.message });
  }
};

// Delete single or multiple classes
exports.deleteClass = async (req, res) => {

  try {
    let id = [];

    if (Array.isArray(req.body.id)) {
      id = req.body.id;
    } else if (typeof req.body.id === 'string') {
      id = req.body.id.split(',').map(id => id.trim());
    }

    if (!id.length || id.some(id => !id)) {
      return res.status(400).json({ message: 'No valid class IDs provided' });
    }

    const result = await ClassMaster.deleteMany({ _id: { $in: id } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No classes found to delete' });
    }

    res.status(200).json({ message: `${result.deletedCount} class deleted` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting class(es)', error: error.message });
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