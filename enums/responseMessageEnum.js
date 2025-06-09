const RESPONSE_MESSAGES = {
  ADMIN_EXISTS: "Admin already exists",
  ADMIN_REGISTERED: "Admin registered successfully. Please verify OTP sent to your email.",
  ADMIN_NOT_FOUND: "Admin not found",
  INVALID_CREDENTIALS: "Invalid credentials",
  TOKEN_INVALID: "Invalid or expired token",
  NO_TOKEN: "No token, authorization denied",
  OTP_SENT: "OTP sent successfully",
  OTP_INVALID: "Invalid or expired OTP",
  OTP_VERIFIED: "OTP verified successfully",
  PASSWORD_RESET_SUCCESS: "Password reset successfully",
  LOGIN_OTP_SENT: "OTP sent for login verification",
  LOGIN_SUCCESS: "Login successful",
};

module.exports = RESPONSE_MESSAGES;
