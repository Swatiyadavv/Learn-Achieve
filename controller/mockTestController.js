const mockTestService = require("../service/mockTestService");

const createMockTest = async (req, res) => {
  try {
    const data = { ...req.body,
      medium: req.body.medium ? req.body.medium.split(",").map(s => s.trim()) : [],
      class: req.body.class ? req.body.class.split(",").map(s => s.trim()) : [],
      subjects: req.body.subjects ? req.body.subjects.split(",").map(s => s.trim()) : [],
    };

    const result = await mockTestService.createMockTest(data, req.admin.id);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllMockTests = async (req, res) => {
  const tests = await mockTestService.getAllMockTests();
  res.json(tests);
};

const getMyMockTests = async (req, res) => {
  const tests = await mockTestService.getMyMockTests(req.admin.id);
  res.json(tests);
};

const updateMockTest = async (req, res) => {
  try {
    const data = {
      ...req.body,
      medium: req.body.medium ? req.body.medium.split(",").map(s => s.trim()) : undefined,
      class: req.body.class ? req.body.class.split(",").map(s => s.trim()) : undefined,
      subjects: req.body.subjects ? req.body.subjects.split(",").map(s => s.trim()) : undefined,
    };

  
    Object.keys(data).forEach(key => {
      if (data[key] === undefined) delete data[key];
    });

    const test = await mockTestService.updateMockTest(req.params.id, data, req.admin.id);
    res.json(test);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


const deleteMockTest = async (req, res) => {
  try {
    const result = await mockTestService.deleteMockTest(req.params.id, req.admin.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const searchMockTests = async (req, res) => {
  const { name } = req.body;
  const tests = await mockTestService.searchMockTests(name, req.admin.id);
  res.json(tests);
};


const changeMockTestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; 

    const updatedTest = await mockTestService.updateMockTestStatus(id, req.admin.id, status);

    res.json({ message: `Status updated to ${status}`, mockTest: updatedTest });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createMockTest,
  getAllMockTests,
  changeMockTestStatus,
  getMyMockTests,
  updateMockTest,
  deleteMockTest,
  searchMockTests
};
