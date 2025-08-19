const PendingStudent = require("../model/PendingStudent");
const mongoose = require('mongoose');
const Student = require("../model/studentModel");
const generateOTP = require("../utils/generateOtp");
const generatePassword = require("../utils/passwordUtils");
const sendMail = require("../utils/sendMail");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Coordinator = require("../model/coordinatorModel");
const Order = require("../model/Order");
const Withdrawal = require("../model/withdrawalModel");
//  Student Add Service


// Student request create karega
exports.createWithdrawal = async (studentId, amount) => {
  if (!studentId || !amount) throw new Error("studentId and amount required");

  const withdrawal = new Withdrawal({ studentId, amount });
  return await withdrawal.save();
};

// Admin update karega


// Student / Coordinator view-only withdrawals


exports.getWithdrawalRequests = async (studentId) => {
  if (!studentId) throw new Error("studentId required");

  const withdrawals = await Withdrawal.find({ studentId })
    .sort({ createdAt: -1 });

  // Sirf status return karwana hai
  return withdrawals.map(w => ({
    id: w._id,
    status: w.status
  }));
};




exports.getStudents = async ({ from, to, search = "", limit, offset }) => {
  let query = {};

  // 🔹 Date range filter
  if (from && to) {
    query.createdAt = { $gte: new Date(from), $lte: new Date(to) };
  }

  // 🔹 Search filter
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { "contactDetails.email": { $regex: search, $options: "i" } }
    ];
  }

  // 🔹 Count + Pagination
  const total = await Student.countDocuments(query);

  const students = await Student.find(query)
    .skip(offset)
    .limit(limit)
    .sort({ createdAt: -1 });

  return { total, students };
};



exports.getStudentEarnings = async (userId) => {
  const orders = await Order.find({ userId });

  let totalEarned = 0;
  let totalDiscount = 0;
  let totalBalance = 0;

  orders.forEach(order => {
    totalEarned += order.totalAmount;
    totalDiscount += order.discountAmt + Number(order.referralDiscount || 0);
    totalBalance += order.packages.reduce(
      (sum, pkg) => sum + ((pkg.originalPrice - pkg.priceAtOrder) * pkg.quantity), 0
    );
  });

  return {
    totalStudents: 1, // kyunki yeh single userId ka data hai
    totalEarned,
    totalDiscount,
    totalBalance,
    students: [
      {
        actualPrice: totalEarned + totalDiscount,
        paymentReceived: totalEarned,
        discountGiven: totalDiscount,
        balance: totalBalance
      }
    ]
  };
};


//  Register Student - Step 1
exports.registerStudent = async (data) => {
  const { email, mobile } = data.contactDetails || {};
  if (!email || !mobile) throw new Error("Email and mobile number are required.");
  if (data.registerBy === "Coordinator" && !data.uniqueCode) {
    throw new Error("Unique code is required for Coordinator registration.");
  }
  // Remove old pending registration if exists
  await PendingStudent.findOneAndDelete({ "contactDetails.email": email });
  const otp = generateOTP().toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await PendingStudent.create({ ...data, otp, otpExpiry });
  await sendMail(
    email,
    "Student OTP Verification - Smart School",
    `<h2>Your OTP is: ${otp}</h2><p>It is valid for 10 minutes.</p>`
  );
  return { message: "OTP sent to student's email for verification." };
};

//  Verify OTP - Step 2
exports.verifyStudentOTP = async (email, otp) => {
  const pending = await PendingStudent.findOne({ "contactDetails.email": email });
  if (!pending) throw new Error("No pending registration found for this email.");
  if (pending.otp !== otp.toString() || pending.otpExpiry < new Date()) {
    throw new Error("Invalid or expired OTP.");
  }
  const { mobile } = pending.contactDetails || {};
  if (!mobile) throw new Error("Mobile number missing in pending registration.");
  const existing = await Student.findOne({ "contactDetails.mobile": mobile });
  if (existing) throw new Error("A student with this mobile number already exists.");
  const rawPassword = generatePassword();
  const hashedPassword = await bcrypt.hash(rawPassword, 10);
  const studentData = pending.toObject();
  delete studentData._id;
  delete studentData.otp;
  delete studentData.otpExpiry;
  await Student.create({
    ...studentData,
    password: hashedPassword,
  });
  await PendingStudent.deleteOne({ _id: pending._id });
  await sendMail(
    email,
    "Your Smart School Account Password",
    `<h2>Your generated password is: ${rawPassword}</h2><p>Use it to log in to your account.</p>`
  );
  return { message: "Student verified. Password sent to email." };
};

//  Login Request - Send OTP
exports.loginRequestStudent = async (email) => {
  const student = await Student.findOne({ "contactDetails.email": email });
  if (!student) throw new Error("No student account associated with this email.");
  const otp = generateOTP().toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  student.otp = otp;
  student.otpExpiry = otpExpiry;
  await student.save();
  await sendMail(
    email,
    "Login OTP - Smart School",
    `<h2>Your login OTP is: ${otp}</h2><p>This OTP is valid for 10 minutes.</p>`
  );
  return { message: "Login OTP sent to email." };
};

exports.loginVerifyStudent = async (email, otp) => {
  const student = await Student.findOne({ "contactDetails.email": email });
  if (!student) throw new Error("Student not found.");
  console.log("Email:", email);
  console.log("Entered OTP:", otp);
  console.log("Stored OTP:", student.otp);
  console.log("Stored OTP Type:", typeof student.otp);
  console.log("Entered OTP Type:", typeof otp);
  console.log("Expiry Time:", student.otpExpiry);
  console.log("Current Time:", new Date());
  console.log("Is OTP Expired?", student.otpExpiry < new Date());
  console.log("OTP Match?", student.otp?.toString() === otp?.toString());
   if (!student.otp || student.otp.toString() !== otp.toString() || student.otpExpiry < new Date()) {
    throw new Error("Invalid or expired OTP.");
  }
  student.otp = undefined;
  student.otpExpiry = undefined;
  await student.save();
   const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
 return { token, student };
};

