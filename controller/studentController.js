
const studentService = require("../service/studentService");
const Student = require("../model/studentModel");


exports.getAllStudents = async (req, res) => {
  try {
    const coordinators = await studentService.getAllStudents();
    res.status(200).json({ total: coordinators.length, coordinators });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// 2️⃣ Get students by date range
exports.getStudentsByDate = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) return res.status(400).json({ message: "from and to dates required" });

    const students = await Student.find({
      createdAt: { $gte: new Date(from), $lte: new Date(to) }
    });

    res.status(200).json({ total: students.length, students });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3️⃣ Pagination + search
exports.getStudentsPaginate = async (req, res) => {
  try {
    let { limit = 10, offset = 0, search = "" } = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);

    const query = search
      ? { $or: [
          { "firstName": { $regex: search, $options: "i" } },
          { "lastName": { $regex: search, $options: "i" } },
          { "contactDetails.email": { $regex: search, $options: "i" } }
        ]}
      : {};

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({ total, students });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
