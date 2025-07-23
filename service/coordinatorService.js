const Coordinator = require('../model/coordinatorModel');
const generateUniqueCode = require('../utils/generateCode');

exports.createCoordinator = async (data) => {
  const uniqueCode = await generateUniqueCode(); 
  const coordinator = new Coordinator({ ...data, uniqueCode }); 
  return await coordinator.save();
};

// Update existing coordinator
exports.updateCoordinator = async (id, data) => {
  const updated = await Coordinator.findByIdAndUpdate(id, data, { new: true });
  return updated;
}


// Delete one
exports.deleteSingle = async (id) => {
  return await Coordinator.findByIdAndDelete(id);
};

// Delete many
exports.deleteMultiple = async (ids) => {
  return await Coordinator.deleteMany({ _id: { $in: ids } });
};

exports.getCoordinators = async ({ search, limit, offset }) => {
  const query = {};

  if (search) {
    query.name = { $regex: search, $options: 'i' }; // case-insensitive partial match
  }

  const total = await Coordinator.countDocuments(query);

  const data = await Coordinator.find(query)
    .skip(offset)
    .limit(limit)
    .sort({ createdAt: -1 });

  return { total, data };
};


exports.toggleStatus = async (id) => {
  const coordinator = await Coordinator.findById(id);
  if (!coordinator) return null;

  coordinator.isActive = !coordinator.isActive;
  await coordinator.save();

  return coordinator;
};
