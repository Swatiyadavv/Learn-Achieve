const coordinatorService = require('../service/coordinatorService');
const generateUniqueCode = require('../utils/generateCode');
// Format date to YYYY-MM-DD
const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

exports.addOrUpdateCoordinator = async (req, res) => {
  try {
    const data = req.body;

    // Format DOB if needed
    if (data.dob) {
      const dateObj = new Date(data.dob);
      if (!isNaN(dateObj)) {
        data.dob = dateObj.toISOString().split('T')[0];
      } else {
        return res.status(400).json({ message: "Invalid DOB format" });
      }
    }

    let result;
    if (data._id) {
      // Prevent uniqueCode from being overwritten
      delete data.uniqueCode;

      result = await coordinatorService.updateCoordinator(data._id, data);
      if (!result) return res.status(404).json({ message: "Coordinator not found" });
    } else {
      // Auto-generate uniqueCode inside service
      result = await coordinatorService.createCoordinator(data);
    }

    const response = {
      ...result._doc,
      dob: formatDate(result.dob), // clean date
    };

    res.status(200).json({
      message: data._id ? "Coordinator updated" : "Coordinator created",
      coordinator: response
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Delete Single or Multiple
exports.deleteCoordinator = async (req, res) => {
  try {
    let { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "_id is required" });
    }

    if (typeof _id === 'string' && _id.includes(',')) {
      _id = _id.split(',').map(id => id.trim());
    }

    if (Array.isArray(_id)) {
      const result = await coordinatorService.deleteMultiple(_id);
      return res.status(200).json({ message: "Multiple coordinators deleted", deletedCount: result.deletedCount });
    } else {
      const result = await coordinatorService.deleteSingle(_id);
      if (!result) return res.status(404).json({ message: "Coordinator not found" });
      return res.status(200).json({ message: "Coordinator deleted", coordinator: result });
    }

  } catch (error) {
    res.status(500).json({ message: "Error deleting coordinator", error: error.message });
  }
};

// Get All Coordinators
exports.getAllCoordinators = async (req, res) => {
  try {
    const coordinators = await coordinatorService.getAllCoordinators();
    const formatted = coordinators.map(c => ({
      ...c._doc,
      dob: formatDate(c.dob)
    }));
    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Coordinator by ID
exports.getCoordinatorById = async (req, res) => {
  try {
    const coordinator = await coordinatorService.getCoordinatorById(req.params.id);
    if (!coordinator) {
      return res.status(404).json({ success: false, message: 'Coordinator not found' });
    }
    const response = {
      ...coordinator._doc,
      dob: formatDate(coordinator.dob)
    };
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search + Pagination
exports.getCoordinators = async (req, res) => {
  try {
    const { search = "", limit = 10, offset = 0 } = req.query;

    const coordinators = await coordinatorService.getCoordinators({
      search,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const formatted = coordinators.data.map(c => ({
      ...c._doc,
      dob: formatDate(c.dob)
    }));

    res.status(200).json({
      message: "Coordinators fetched successfully",
      total: coordinators.total,
      coordinators: formatted,
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching coordinators", error: error.message });
  }
};

// Toggle Active Status

exports.toggleCoordinator = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const updated = await coordinatorService.toggleStatus(id);
    if (!updated) {
      return res.status(404).json({ message: "Coordinator not found" });
    }

    res.status(200).json({
      message: `Coordinator is now ${updated.isActive ? "Active" : "Inactive"}`,
      coordinator: {
        ...updated._doc,
        dob: formatDate(updated.dob)
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Error toggling coordinator", error: error.message });
  }
};

