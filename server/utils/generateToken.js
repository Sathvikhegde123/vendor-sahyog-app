import jwt from "jsonwebtoken";

const generateToken = (vendor) => {
    return jwt.sign(
        {
            userId: vendor._id,
            vendorId: vendor.vendorId,
            role: "VendorAdmin",
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};

export default generateToken;
