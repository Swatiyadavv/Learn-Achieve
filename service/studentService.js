require("dotenv").config(); 

const PendingStudent = require("../model/PendingStudent");
const Student = require("../model/studentModel");
const { otp, sentOtp } = require("../utils/otpUtils");
const { generatePassword } = require("../utils/passwordUtils");
const bcrypt = require("bcryptjs");
const OTP = require("../model/otpModel");
const generateOTP = require("../utils/generateOtp");
const sendMail = require("../utils/sendMail");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET; 

exports.addContactDetails = async (data) => {
  const {
    pendingStudentId, email, mobile,
    addressLine1, addressLine2,
    state, district, taluka, pinCode
  } = data;

  const student = await PendingStudent.findById(pendingStudentId);
  if (!student) throw new Error("Student not found");

  if (student.registerBy === "Coordinator" && !student.uniqueCode) {
    throw new Error("Coordinator must provide a unique code before adding contact details");
  }

  if (state === "Madhya Pradesh") {
    if (!district || !taluka || !pinCode) {
      throw new Error("District, taluka, and pin code are required for Madhya Pradesh");
    }

    student.district = district;
    student.taluka = taluka;
    student.pinCode = pinCode;
  } else {
    student.district = undefined;
    student.taluka = undefined;
    student.pinCode = undefined;
  }

  const generatedOtp = otp();
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

  student.email = email;
  student.mobile = mobile;
  student.addressLine1 = addressLine1;
  student.addressLine2 = addressLine2;
  student.state = state;
  student.otp = generatedOtp;
  student.otpExpiresAt = otpExpiresAt;

  await student.save();
  await sentOtp(email, generatedOtp);

  return {
    message: "OTP sent to email",
    pendingStudent: {
      _id: student._id,
      email: student.email,
      mobile: student.mobile,
      addressLine1: student.addressLine1,
      addressLine2: student.addressLine2,
      state: student.state,
      district: student.district,
      taluka: student.taluka,
      pinCode: student.pinCode
    }
  };
};

exports.verifyOtpAndRegister = async (pendingStudentId, otp) => {
  const pending = await PendingStudent.findById(pendingStudentId);
  if (!pending) throw new Error("Pending student not found");

  if (pending.otp !== otp || pending.otpExpiresAt < Date.now()) {
    throw new Error("Invalid or expired OTP");
  }

  const plainPassword = generatePassword();
  console.log("Generated Password for Student:", plainPassword);
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const student = new Student({
    firstName: pending.firstName,
    middleName: pending.middleName,
    lastName: pending.lastName,
    dob: pending.dob,
    gender: pending.gender,
    medium: pending.medium,
    class: pending.class,
    schoolName: pending.schoolName,
    registerBy: pending.registerBy,
    password: hashedPassword,
    contactDetails: {
      email: pending.email,
      mobile: pending.mobile,
      addressLine1: pending.addressLine1,
      addressLine2: pending.addressLine2,
      state: pending.state,
      district: pending.district,
      taluka: pending.taluka,
      pinCode: pending.pinCode,
    }
  });

  await student.save();
  await PendingStudent.findByIdAndDelete(pendingStudentId);

  const subject = "Registration Successful - Login Credentials";
  const message = `Dear ${student.firstName},\n\nYou have been successfully registered.\nYour login password is: ${plainPassword}\n\nKeep it safe.\n\nRegards,\nTeam`;

  await sentOtp(student.contactDetails.email, message, subject);

  return {
    message: "Student registered successfully",
    student: {
      ...student.toObject(),
      dob: student.dob.toISOString().split("T")[0],
    }
  };
};

exports.addPersonalDetails = async (data) => {
  const {
    firstName,
    middleName,
    lastName,
    dob,
    gender,
    medium,
    class: studentClass,
    schoolName,
    registerBy,
    uniqueCode,
  } = data;

  const newStudent = await PendingStudent.create({
    firstName,
    middleName,
    lastName,
    dob: new Date(dob),
    gender,
    medium,
    class: studentClass,
    schoolName,
    registerBy,
    uniqueCode: registerBy === "Coordinator" ? uniqueCode : undefined,
  });

  return {
    message: "Personal details saved",
    pendingStudent: {
      _id: newStudent._id,
      firstName: newStudent.firstName,
      middleName: newStudent.middleName,
      lastName: newStudent.lastName,
      dob: newStudent.dob.toISOString().split("T")[0],
      gender: newStudent.gender,
      medium: newStudent.medium,
      class: newStudent.class,
      schoolName: newStudent.schoolName,
      registerBy: newStudent.registerBy,
      uniqueCode: newStudent.uniqueCode || undefined
    },
  };
};

exports.loginStudent = async (email, password) => {
  const student = await Student.findOne({ "contactDetails.email": email });

  if (!student) {
    throw new Error("Student not found with this email");
  }

  const isMatch = await bcrypt.compare(password, student.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  return {
    message: "Login successful",
    student: {
      _id: student._id,
      name: `${student.firstName} ${student.lastName}`,
      email: student.contactDetails.email,
    },
  };
};


// Step 1: Request OTP after verifying password
exports.requestLoginOtp = async (email, password) => {
  const student = await Student.findOne({ "contactDetails.email": email });

  if (!student) {
    throw new Error("Student not found with this email");
  }

  const isMatch = await bcrypt.compare(password, student.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const otp = generateOTP();
  await OTP.deleteMany({ email });
  await OTP.create({ email, otp });
  await sendMail(email, "Login OTP", `Your login OTP is: ${otp}`);

  return "OTP sent to your email";
};

// Step 2: Verify OTP and issue token
exports.verifyLoginOtp = async (email, otp) => {
  const existingOtp = await OTP.findOne({ email, otp });
  if (!existingOtp) {
    throw new Error("Invalid or expired OTP");
  }

  const student = await Student.findOne({ "contactDetails.email": email });
  if (!student) {
    throw new Error("Student not found");
  }

  const token = jwt.sign({ id: student._id }, JWT_SECRET, {
    expiresIn: "7d",
  });

  await OTP.deleteMany({ email });

  return {
    message: "Login successful",
    token,
    student: {
      _id: student._id,
      name: `${student.firstName} ${student.lastName}`,
      email: student.contactDetails.email,
    },
  };
};

exports.forgotPasswordRequest = async (email) => {
  const student = await Student.findOne({ "contactDetails.email": email });
  if (!student) throw new Error("Student not found with this email");

  const otp = generateOTP();

  await OTP.deleteMany({ email }); // clear old OTPs
  await OTP.create({ email, otp });

  await sendMail(email, "Password Reset OTP", `Your OTP is: ${otp}`);
  return { message: "OTP sent to your email for password reset" };
};

exports.verifyForgotPasswordOtp = async (email, otp) => {
  const validOtp = await OTP.findOne({ email, otp });
  if (!validOtp) throw new Error("Invalid or expired OTP");

  return { message: "OTP verified successfully" };
};
exports.resetPassword = async (email, newPassword) => {
  const student = await Student.findOne({ "contactDetails.email": email });
  if (!student) throw new Error("Student not found");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  student.password = hashedPassword;
  await student.save();

  await OTP.deleteMany({ email }); // clean up

  return { message: "Password reset successful" };
};
