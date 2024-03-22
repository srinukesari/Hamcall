// Middleware to verify JWT token
const { jwt } = require("../cmd/init");

function verifyToken(req, res, next) {
  if (process.env.NODE_ENV === "test") {
    req.userId = "9898989898";
    return next();
  }
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.userId = decoded.userId;
    next();
  });
}

module.exports = verifyToken;
