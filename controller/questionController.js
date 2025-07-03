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
