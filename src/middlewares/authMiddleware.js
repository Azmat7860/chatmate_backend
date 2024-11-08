import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "chat_app_secret");
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token." });
  }
};
