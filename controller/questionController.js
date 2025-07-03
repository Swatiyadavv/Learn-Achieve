const questionBankService = require("../service/questionService");

exports.addOrUpdateQuestionBank = async (req, res) => {
  try {
    const result = await questionBankService.createOrUpdateQuestionBank(req.body);
    res.status(200).json({
      success: true,
      message: req.body.id ? "Updated successfully" : "Created successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


exports.getFilteredQuestionBank = async (req, res) => {
  try {
    const result = await questionBankService.getFilteredQuestionBank(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.changeStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await questionBankService.updateStatus(id, status);
      res.status(200).json({ message: 'Status updated', question: result });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };



  // Smart Delete (single or multiple)
    exports.deleteSubjectSmart =async (req, res) => {
      try {
        const { id, ids } = req.body;
  
        if (id) {
          await questionBankService.deleteSubject(id);
          return res.status(200).json({ message: 'question deleted' });
        }
  
        if (Array.isArray(ids) && ids.length > 0) {
          await questionBankService.deleteMultiple(ids);
          return res.status(200).json({ message: 'questions deleted successfully' });
        }
  
        return res.status(400).json({ message: 'Please provide id or ids[] to delete' });
      } catch (err) {
        res.status(500).json({ message: 'Delete failed', error: err.message });
      }
    };