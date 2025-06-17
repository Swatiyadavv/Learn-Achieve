const subjectService = require('../service/subjectService');

const subjectController = {
 addOrUpdateSubject: async (req, res) => {
  try {
    const { name, subject } = req.body;
    const file = req.file;
    const createdBy = req.admin.id;

    const image = file ? `${req.protocol}://${req.get('host')}/uploads/${file.filename}` : null;

    // Don't extract id from req.body
    const result = await subjectService.addOrUpdateSubject({
      name,
      subject,
      image,
      createdBy,
      id: req.body.id // This is optional. If not passed, creation will happen.
    });

    res.status(201).json({ message: req.body.id ? 'Subject updated' : 'Subject added', subject: result });
  } catch (err) {
    res.status(500).json({ message: 'Operation failed', error: err.message });
  }
},


  deleteSubject: async (req, res) => {
    try {
      await subjectService.deleteSubject(req.params.id);
      res.status(200).json({ message: 'Subject deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Delete failed', error: err.message });
    }
  },

deleteAllSubjectsByAdmin: async (req, res) => {
  try {
    const adminId = req.admin.id; // from token
    await subjectService.deleteAllByAdmin(adminId);
    res.status(200).json({ message: 'All your subjects deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
},
  // getAllSubjects: async (req, res) => {
  //   try {
  //     const subjects = await subjectService.getAllSubjects();
  //     res.status(200).json(subjects);
  //   } catch (err) {
  //     res.status(500).json({ message: 'Fetch failed', error: err.message });
  //   }
  // },
  getAllSubjects: async (req, res) => {
  try {
    const adminId = req.admin.id;
    const subjects = await subjectService.getAllSubjects(adminId);
    res.status(200).json(subjects);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
},

  getPaginatedSubjects: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const offset = parseInt(req.query.offset) || 0;
      const result = await subjectService.getPaginatedSubjects(limit, offset);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: 'Fetch failed', error: err.message });
    }
  },

  searchSubjects: async (req, res) => {
    try {
      const { query } = req.query;
      if (!query) return res.status(400).json({ message: 'Search query required' });
      const result = await subjectService.searchSubjects(query);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: 'Search failed', error: err.message });
    }
  },

  changeMockTestStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await subjectService.updateMockTestStatus(id, req.admin._id, status);
      res.status(200).json({ message: 'Status updated', subject: result });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};

module.exports = subjectController;
