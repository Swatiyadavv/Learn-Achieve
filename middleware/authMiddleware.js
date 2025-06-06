const jwt = require("jsonwebtoken");
const RESPONSE_MESSAGES = require("../enums/responseMessageEnum");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.admin = decoded; // contains id & role
      next();
    } catch (err) {
      return res.status(401).json({ message: RESPONSE_MESSAGES.TOKEN_INVALID });
    }
  } else {
    return res.status(401).json({ message: RESPONSE_MESSAGES.NO_TOKEN });
  }
};

module.exports = { protect };
