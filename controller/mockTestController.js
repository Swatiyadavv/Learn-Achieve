const mockTestService = require("../service/mockTestService");
const mockTestController ={
 createMockTest : async (req, res) => {
  try {
    const data = { ...req.body,
      medium: req.body.medium ? req.body.medium.split(",").map(s => s.trim()) : [],
      class: req.body.class ? req.body.class.split(",").map(s => s.trim()) : [],
      subjects: req.body.subjects ? req.body.subjects.split(",").map(s => s.trim()) : [],
    }
    const result = await mockTestService.createMockTest(data, req.admin.id);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
},

 getAllMockTests : async (req, res) => {
  const tests = await mockTestService.getAllMockTests();
  res.json(tests);
},

 getMyMockTests : async (req, res) => {
  const tests = await mockTestService.getMyMockTests(req.admin.id);
  res.json(tests);
},

 updateMockTest : async (req, res) => {
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
},

 deleteMockTest : async (req, res) => {
  try {
    const result = await mockTestService.deleteMockTest(req.params.id, req.admin.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
},
allDeleteMockTest: async (req, res) => {
  try {
    const result = await mockTestService.allDeleteMockTests(req.admin.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
},
 searchMockTest : async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Search query missing' });

    const results = await mockTestService.searchMockTest(query);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error during search', error: error.message });
  }
},



 changeMockTestStatus : async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; 

    const updatedTest = await mockTestService.updateMockTestStatus(id, req.admin.id, status);

    res.json({ message: `Status updated to ${status}`, mockTest: updatedTest });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
},

getPaginatedPackages : async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);

    if (isNaN(limitNum) || isNaN(offsetNum)) {
      return res.status(400).json({ message: 'Limit and offset must be valid numbers' });
    }

    const paginatedData = await mockTestService.getPaginatedPackages(limitNum, offsetNum);
    
    res.status(200).json(paginatedData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch packages', error: error.message });
  }
},
}
module.exports = mockTestController;