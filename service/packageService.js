const Package = require('../model/Package');
const fs = require('fs');
const path = require('path');

const addPackage = async ({
  packageName,
  className,
  medium,
  mockTests,
  numberOfAttempts,
  platform,
  actualPrice,
  discountPrice,
  validityInDays,
  image
}) => {
  const newPackage = new Package({
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

  await newPackage.save();
  return newPackage;
};

const deletePackage = async (id) => {
  const packageToDelete = await Package.findById(id);
  if (!packageToDelete) {
    throw new Error('Package not found');
  }

  if (packageToDelete.image) {
    const imagePath = path.resolve(packageToDelete.image);
    fs.unlink(imagePath, (err) => {
      if (err) console.error('Failed to delete image:', err);
    });
  }

  await Package.findByIdAndDelete(id);
};

const getAllPackages = async () => {
  return await Package.find();
};


const updatePackage = async (id, updatedData, file) => {
  const pkg = await Package.findById(id);
  if (!pkg) throw new Error('Package not found');

  // Update simple fields if they exist in updatedData
  if (updatedData.packageName) pkg.packageName = updatedData.packageName;
  if (updatedData.className) pkg.className = updatedData.className;
  if (updatedData.medium) pkg.medium = updatedData.medium;

  if (updatedData.mockTests) {
    if (typeof updatedData.mockTests === 'string') {
      // convert comma separated string to array
      pkg.mockTests = updatedData.mockTests.split(',').map(item => item.trim());
    } else if (Array.isArray(updatedData.mockTests)) {
      pkg.mockTests = updatedData.mockTests;
    }
  }

  if (updatedData.numberOfAttempts) pkg.numberOfAttempts = updatedData.numberOfAttempts;
  if (updatedData.platform) pkg.platform = updatedData.platform;
  if (updatedData.actualPrice) pkg.actualPrice = updatedData.actualPrice;
  if (updatedData.discountPrice) pkg.discountPrice = updatedData.discountPrice;
  if (updatedData.validityInDays) pkg.validityInDays = updatedData.validityInDays;

  // Toggle active/deactive: updatedData.isActive can be boolean or string "true"/"false"
  if (typeof updatedData.isActive !== 'undefined') {
    if (typeof updatedData.isActive === 'string') {
      pkg.isActive = updatedData.isActive.toLowerCase() === 'true';
    } else {
      pkg.isActive = updatedData.isActive;
    }
  }

  // Update image if new file uploaded
  if (file) {
    // Delete old image file if exists
    if (pkg.image) {
      const oldImagePath = path.join(__dirname, '..', 'uploads', path.basename(pkg.image));
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error('Failed to delete old image:', err);
      });
    }

    pkg.image = `${file.protocol || 'http'}://${file.host || 'localhost:5000'}/uploads/${file.filename}`;
  }

  await pkg.save();
  return pkg;
};




const searchPackages = async (query) => {
  const trimmedQuery = query.trim();

  return await Package.find({
    packageName: { $regex: `^${trimmedQuery}$`, $options: 'i' } // exact match, case-insensitive
  });
};


// const searchPackages = async (query) => {
//   const words = query.trim().split(/\s+/);

//   const regexArray = words.map(word => ({
//     packageName: { $regex: word, $options: 'i' },
//   }));

//   return await Package.find({ $and: regexArray });
// };




module.exports = {
  addPackage,
  deletePackage,
  getAllPackages,
  updatePackage,
  searchPackages
};
