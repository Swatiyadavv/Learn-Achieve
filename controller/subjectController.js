const subjectService = require('../service/subjectService');

const subjectController = {
  addSubject: async (req, res) => {
    try {
      const { name, Subject: subjectName } = req.body;
      const file = req.file;

      const image = file
        ? `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
        : null;

      const newSubject = await subjectService.addSubject({
        name,
        Subject: subjectName,
        image,
      });

      res.status(201).json({ message: 'Subject added successfully', subject: newSubject });
    } catch (error) {
      res.status(500).json({ message: 'Failed to add subject', error: error.message });
    }
  },

  deleteSubject: async (req, res) => {
    try {
      const { id } = req.params;
      await subjectService.deleteSubject(id);
      res.status(200).json({ message: 'Subject deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete subject', error: error.message });
    }
  },

  getAllSubjects: async (req, res) => {
    try {
      const allSubjects = await subjectService.getAllSubjects();
      res.status(200).json(allSubjects);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching subjects', error: error.message });
    }
  },

  getPaginatedSubjects: async (req, res) => {
    try {
      const { limit = 10, offset = 0 } = req.query;

      const limitNum = parseInt(limit);
      const offsetNum = parseInt(offset);

      if (isNaN(limitNum) || isNaN(offsetNum)) {
        return res.status(400).json({ message: 'Limit and offset must be valid numbers' });
      }

      const paginatedData = await subjectService.getPaginatedSubjects(limitNum, offsetNum);
      res.status(200).json(paginatedData);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch subjects', error: error.message });
    }
  },

  updateSubject: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const file = req.file;

      const updatedSubject = await subjectService.updateSubject(id, updatedData, file);
      res.status(200).json({ message: 'Subject updated successfully', subject: updatedSubject });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update subject', error: error.message });
    }
  },

  searchSubjects: async (req, res) => {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ message: 'Search query missing' });
      }

      const results = await subjectService.searchSubjects(query);
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ message: 'Error during search', error: error.message });
    }
  },

  deleteMultipleSubjects: async (req, res) => {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Invalid or empty subject IDs array' });
      }

      await subjectService.deleteMultipleSubjects(ids);
      res.status(200).json({ message: 'Subjects deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete subjects', error: error.message });
    }
  },
};

module.exports = subjectController;
