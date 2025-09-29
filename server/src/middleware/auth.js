const jwt = require("jsonwebtoken");

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Token format: Bearer <token>
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access denied. Token missing." });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });

    req.user = user; // attach user data to request
    next();
  });
};

// Middleware to check role
const roleCheck = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }
    next();
  };
};

// Export both functions
module.exports = { authenticateToken, roleCheck };
