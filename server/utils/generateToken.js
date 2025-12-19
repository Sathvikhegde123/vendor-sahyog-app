import jwt from "jsonwebtoken";

const generateToken = (vendor) => {
  return jwt.sign(
    {
      vendorObjectId: vendor._id.toString(),
      vendorId: vendor.vendorId,
      role: "VendorAdmin",
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export default generateToken;
