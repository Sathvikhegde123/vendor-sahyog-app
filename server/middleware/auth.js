import jwt from "jsonwebtoken";
import Vendor from "../models/Vendor.js";

const vendorAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 THIS MUST MATCH generateToken
    const vendor = await Vendor.findById(decoded.vendorObjectId).select("-password");

    if (!vendor) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.vendor = vendor; // attach vendor to request
    next();
  } catch (err) {
    console.error("JWT ERROR:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

export default vendorAuth;
