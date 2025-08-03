const Coordinator = require('../model/coordinatorModel');

const generateUniqueCode = async () => {
  let code;
  let exists = true;

  while (exists) {
    code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    exists = await Coordinator.exists({ uniqueCode: code });
  }

  return code;
};

module.exports = generateUniqueCode;
