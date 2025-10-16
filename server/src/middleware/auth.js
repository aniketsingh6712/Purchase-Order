const jwt = require("jsonwebtoken");
const User = require("../models/userRecord");


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Token format: Bearer <token>
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access denied. Token missing." });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });

    req.user = user; 
    next();
  });
};

// const authenticateToken = (req, res, next) => {
//    const accessToken = req.cookies?.accessToken;
//   const refreshToken = req.cookies?.refreshToken;
//   // console.log(refreshToken);
  
//   if (!accessToken)
//     return res.status(401).json({ message: "Access token missing" });

//   jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//     if (err) {
//       if (err.name === "TokenExpiredError") {
//         // 🕒 Try refresh token
//         if (!refreshToken)
//           return res.status(403).json({ message: "Refresh token missing" });

//         jwt.verify(
//           refreshToken,
//           process.env.REFRESH_TOKEN_SECRET,
//           (refreshErr, refreshDecoded) => {
//             if (refreshErr)
//               return res
//                 .status(403)
//                 .json({ message: "Invalid or expired refresh token" });

//             // ✅ Generate new access token with same payload
//             const newAccessToken = jwt.sign(
//               {
//                 userId: refreshDecoded.userId,
//                 email: refreshDecoded.email,
//                 role: refreshDecoded.role,
//               },
//               process.env.ACCESS_TOKEN_SECRET,
//               { expiresIn: "2m" }
//             );

//             // Set new access token cookie
//             res.cookie("accessToken", newAccessToken, {
              
//               maxAge: 15 * 60 * 1000,
//             });
            
//             req.user = refreshDecoded;
//             next();
//           }
//         );
//       } else {
//         return res.status(403).json({ message: "Invalid token" });
//       }
//     } else {
//       req.user = decoded;
//       next();
//     }
//   });
// };

const roleCheck = (roles) => {
  return (req, res, next) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }

    next();
  };
};



module.exports = { authenticateToken, roleCheck };
