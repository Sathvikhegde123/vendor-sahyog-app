import jwt from "jsonwebtoken";

const generateToken = (vendor) => {
  return jwt.sign(
    {
      userId: vendor._id,
      vendorObjectId: vendor._id,     // ✅ ObjectId for DB relations
      vendorCode: vendor.vendorId,    // ✅ "VEN-713027" for display
      role: "VendorAdmin",
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};


export default generateToken;
