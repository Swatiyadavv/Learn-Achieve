
// const PendingStudent = require("../model/PendingStudent");
// const Student = require("../model/studentModel");
// const generateOTP = require("../utils/generateOtp");
// const generatePassword = require("../utils/passwordUtils");
// const sendMail = require("../utils/sendMail");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// // Register Student (saves to PendingStudent and sends OTP)
// exports.registerStudent = async (data) => {
//   const { email, mobile } = data.contactDetails || {};

//   if (!email || !mobile) {
//     throw new Error("Email and mobile are required.");
//   }

//   const otp = generateOTP();
//   const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//   //  Remove old pending entry with same email
//   await PendingStudent.findOneAndDelete({ "contactDetails.email": email });

//   await PendingStudent.create({
//     ...data,
//     otp,
//     otpExpiry,
//   });

//   console.log("OTP Generated:", otp);

//   await sendMail(
//     email,
//     "Student OTP Verification - Smart School",
//     `<h2>Your OTP is: ${otp}</h2><p>Valid for 10 minutes.</p>`
//   );

//   return { message: "OTP sent to email" };
// };

// //  Verify OTP and move student to final Student model
// exports.verifyStudentOTP = async (email, otp) => {
//   const pending = await PendingStudent.findOne({ "contactDetails.email": email });

//   if (!pending) throw new Error("Student not found or already verified");

//   console.log("Entered OTP:", otp);
//   console.log("Stored OTP:", pending.otp);
//   console.log("OTP Expiry:", pending.otpExpiry);

//   //OTP validation
//   if (pending.otp !== otp.toString() || pending.otpExpiry < new Date()) {
//     throw new Error("Invalid or expired OTP");
//   }

//   const { mobile } = pending.contactDetails || {};
//   if (!mobile) {
//     throw new Error("Mobile number missing in pending student data");
//   }

//   // ❌ Prevent duplicate student by mobile
//   const existingStudent = await Student.findOne({ "contactDetails.mobile": mobile });
//   if (existingStudent) {
//     throw new Error("A student with this mobile number already exists.");
//   }

//   //  Generate & hash password
//   const rawPassword = generatePassword();
//   const hashedPassword = await bcrypt.hash(rawPassword, 10);
//   console.log("Generated Password:", rawPassword);

//   //  Copy data & cleanup
//   const studentData = pending.toObject();
//   delete studentData._id;
//   delete studentData.otp;
//   delete studentData.otpExpiry;

//   //  Save student
//   await Student.create({
//     ...studentData,
//     password: hashedPassword,
//   });

//   await PendingStudent.deleteOne({ _id: pending._id });

//   //  Send password
//   await sendMail(
//     email,
//     "Your Smart School Password",
//     `<h2>Your password is: ${rawPassword}</h2><p>Please use this to login.</p>`
//   );

//   return { message: "Student verified and password sent to email" };
// };

// exports.loginStudent = async (email, password) => {
//   const student = await Student.findOne({ "contactDetails.email": email });

//   if (!student) {
//     console.log("❌ Email not found:", email);
//     throw new Error("Invalid email or password");
//   }

//   console.log("🔑 Stored Hashed Password:", student.password);
//   console.log("🔐 Entered Password:", password);

//   const isMatch = await bcrypt.compare(password, student.password);
//   console.log("🔍 Password Match:", isMatch);

//   if (!isMatch) {
//     throw new Error("Invalid email or password");
//   }

//   const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
//     expiresIn: "1d",
//   });

//   return { token, student };
// };

const PendingStudent = require("../model/PendingStudent");
const Student = require("../model/studentModel");
const generateOTP = require("../utils/generateOtp");
const generatePassword = require("../utils/passwordUtils");
const sendMail = require("../utils/sendMail");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ✅ Register Student (step 1) - store in PendingStudent
exports.registerStudent = async (data) => {
  const { email, mobile } = data.contactDetails || {};
  if (!email || !mobile) throw new Error("Email and mobile are required.");

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  // Remove old pending entry
  await PendingStudent.findOneAndDelete({ "contactDetails.email": email });

  await PendingStudent.create({ ...data, otp, otpExpiry });

  console.log("OTP Generated:", otp);
  await sendMail(
    email,
    "Student OTP Verification - Smart School",
    `<h2>Your OTP is: ${otp}</h2><p>Valid for 10 minutes.</p>`
  );

  return { message: "OTP sent to email" };
};

// ✅ Verify OTP → move to Student model
exports.verifyStudentOTP = async (email, otp) => {
  const pending = await PendingStudent.findOne({ "contactDetails.email": email });
  if (!pending) throw new Error("Student not found or already verified");

  if (pending.otp !== otp.toString() || pending.otpExpiry < new Date()) {
    throw new Error("Invalid or expired OTP");
  }

  const { mobile } = pending.contactDetails || {};
  if (!mobile) throw new Error("Mobile number missing in pending data");

  const existingStudent = await Student.findOne({ "contactDetails.mobile": mobile });
  if (existingStudent) throw new Error("A student with this mobile already exists.");

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
    "Your Smart School Password",
    `<h2>Your password is: ${rawPassword}</h2><p>Please use this to login.</p>`
  );

  return { message: "Student verified and password sent to email" };
};

//
// 🔐 STEP 1: Login request (email + password) → send OTP
//
exports.loginRequestStudent = async (email, password) => {
  const student = await Student.findOne({ "contactDetails.email": email });
  if (!student) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, student.password);
  if (!isMatch) throw new Error("Invalid email or password");

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  student.otp = otp;
  student.otpExpiry = otpExpiry;
  await student.save();

  await sendMail(
    email,
    "Login OTP - Smart School",
    `<h2>Your login OTP is: ${otp}</h2><p>It will expire in 10 minutes.</p>`
  );

  return { message: "OTP sent to email" };
};

//
// 🔓 STEP 2: Login verify (email + otp) → return token
//
exports.loginVerifyStudent = async (email, otp) => {
  const student = await Student.findOne({ "contactDetails.email": email });
  if (!student) throw new Error("Student not found");

  if (student.otp !== otp.toString() || student.otpExpiry < new Date()) {
    throw new Error("Invalid or expired OTP");
  }

  student.otp = undefined;
  student.otpExpiry = undefined;
  await student.save();

  const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return { token, student };
};
