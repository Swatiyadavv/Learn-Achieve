const packageService = require('../service/packageService');

const addPackage = async (req, res) => {
  try {
    const {
      packageName,
      className,
      medium,
      mockTests,
      numberOfAttempts,
      platform,
      actualPrice,
      discountPrice,
      validityInDays,
    } = req.body;

    const file = req.file;

    const image = file
      ? `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
      : null;

    const newPackage = await packageService.addPackage({
      packageName,
      className,
      medium,
      mockTests, 
      numberOfAttempts,
      platform,
      actualPrice,
      discountPrice,
      validityInDays,
      image,
    });

    res.status(201).json({ message: 'Package added successfully', package: newPackage });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add package', error: error.message });
  }
};

const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    await packageService.deletePackage(id);

    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete package', error: error.message });
  }
};

const getAllPackages = async (req, res) => {
  try {
    const all = await packageService.getAllPackages();
    res.status(200).json(all);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching packages', error: err.message });
  }
};

const editPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      packageName,
      className,
      medium,
      mockTests,
      numberOfAttempts,
      platform,
      actualPrice,
      discountPrice,
      validityInDays,
    } = req.body;

    const file = req.file;
    const image = file
      ? `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
      : null;

    const mockTestsArray = mockTests
      ? mockTests.split(',').map((item) => item.trim())
      : [];

    const updatedData = {
      packageName,
      className,
      medium,
      mockTests: mockTestsArray,
      numberOfAttempts,
      platform,
      actualPrice,
      discountPrice,
      validityInDays,
    };

    if (image) updatedData.image = image;

    const updated = await packageService.editPackage(id, updatedData);
    res.status(200).json({ message: 'Package updated successfully', package: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update package', error: error.message });
  }
};




module.exports = {
  addPackage,
  deletePackage,
  getAllPackages,
  editPackage
};
