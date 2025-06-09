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


const editPackage = async (id, updatedData) => {
  const existing = await Package.findById(id);
  if (!existing) throw new Error('Package not found');

  Object.assign(existing, updatedData);
  await existing.save();
  return existing;
};




module.exports = {
  addPackage,
  deletePackage,
  getAllPackages,
  editPackage
};
