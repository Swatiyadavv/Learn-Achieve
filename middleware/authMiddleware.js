const jwt = require("jsonwebtoken");
const RESPONSE_MESSAGES = require("../enums/responseMessageEnum");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.admin = decoded; // id & role
      next();
    } catch (err) {
      return res.status(401).json({ message: RESPONSE_MESSAGES.TOKEN_INVALID });
    }
  } else {
    return res.status(401).json({ message: RESPONSE_MESSAGES.NO_TOKEN });
  }
};
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};


module.exports = { protect ,verifyToken};
