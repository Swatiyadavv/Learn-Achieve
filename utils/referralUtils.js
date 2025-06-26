exports.generateReferralCode = (email = "") => {
  const prefix = email.split("@")[0].slice(0, 3).toUpperCase(); // Takes first 3 letters of the email's local part (before @)
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase(); // Generates a 4-letter random alphanumeric string
  return `${prefix}${suffix}`; // Combines both to form a referral code
}





