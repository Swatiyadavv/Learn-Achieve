const studentService = require("../service/studentService");
const Student = require("../model/studentModel");
// const studentService = require("../service/studentService");
// const withdrawalService = require("../model/withdrawalModel");

// Student create withdrawal request
exports.createWithdrawal = async (req, res) => {
  try {
    const studentId = req.user.id;   // token se aa raha hai
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount required" });
    }

    const withdrawal = await studentService.createWithdrawal(studentId, amount);

    res.status(201).json({
      message: "Withdrawal request created",
      withdrawal,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin update withdrawal status
exports.getWithdrawalRequests = async (req, res) => {
  try {
    const studentId = req.user.id; // token se Student._id
    const withdrawals = await studentService.getWithdrawalRequests(studentId);

    res.status(200).json({ success: true, withdrawals });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.getStudents = async (req, res) => {
  try {
    let { from, to, search, limit, offset } = req.query;

    // 🔹 Validation
    if (limit && isNaN(limit)) {
      return res.status(400).json({ message: "limit must be a number" });
    }
    if (offset && isNaN(offset)) {
      return res.status(400).json({ message: "offset must be a number" });
    }
    if ((from && !to) || (!from && to)) {
      return res.status(400).json({ message: "both from and to dates are required" });
    }
    if (from && to && new Date(from) > new Date(to)) {
      return res.status(400).json({ message: "from date cannot be greater than to date" });
    }

    // Defaults
    limit = limit ? parseInt(limit) : 10;
    offset = offset ? parseInt(offset) : 0;

    // 🔹 Call Service
    const result = await studentService.getStudents({
      from,
      to,
      search,
      limit,
      offset,
    });

    // 🔹 Response
    res.status(200).json({
      success: true,
      total: result.total,
      limit,
      offset,
      students: result.students,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4️⃣ Earnings summary
 exports.getStudentEarnings = async (req, res) => {
  try {
  const earnings = await studentService.getStudentEarnings(req.user._id);


    res.status(200).json(earnings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.registerStudent = async (req, res) => {
  try {
    const result = await studentService.registerStudent(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.verifyStudentOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const result = await studentService.verifyStudentOTP(email, otp);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Step 1: Login request → verify email/password → send OTP
exports.loginRequestStudent = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await studentService.loginRequestStudent(email, password);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.loginVerifyStudent = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const result = await studentService.loginVerifyStudent(email, otp);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
