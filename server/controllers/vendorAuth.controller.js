import bcrypt from "bcryptjs";
import Vendor from "../models/Vendor.js";
import generateToken from "../utils/generateToken.js";

/**
 * ✅ REGISTER VENDOR
 * Enterprise onboarding
 */
export const registerVendor = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            enterpriseName,
            phone,
            gstNumber,
            vendorLicense,
            address,
        } = req.body;

        // ✅ Basic validation
        if (
            !name ||
            !email ||
            !password ||
            !enterpriseName ||
            !phone ||
            !vendorLicense
        ) {
            return res.status(400).json({
                error: "Missing required vendor details",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // ✅ Unique email check
        const existingVendor = await Vendor.findOne({ email: normalizedEmail });
        if (existingVendor) {
            return res.status(409).json({
                error: "Vendor with this email already exists",
            });
        }

        // ✅ Generate Vendor ID
        const vendorId = `VEN-${Date.now().toString().slice(-6)}`;

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create Vendor
        const vendor = await Vendor.create({
            vendorId,
            name,
            email: normalizedEmail,
            password: hashedPassword,
            enterpriseName,
            phone,
            gstNumber,
            vendorLicense,
            address,
        });

        return res.status(201).json({
            message: "Vendor registered successfully",
            vendor: {
                vendorId: vendor.vendorId,
                name: vendor.name,
                enterpriseName: vendor.enterpriseName,
                email: vendor.email,
            },
        });
    } catch (err) {
        console.error("Vendor Register Error:", err);
        return res.status(500).json({
            error: "Failed to register vendor",
        });
    }
};

/**
 * ✅ LOGIN VENDOR
 */
export const loginVendor = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // ✅ Find vendor by email
        const vendor = await Vendor.findOne({ email: normalizedEmail });

        if (!vendor) {
            return res.status(401).json({
                error: "Invalid credentials",
            });
        }

        // ✅ Compare password
        const match = await bcrypt.compare(password, vendor.password);
        if (!match) {
            return res.status(401).json({
                error: "Invalid credentials",
            });
        }

        // ✅ Generate JWT
        const token = generateToken(vendor);

        return res.status(200).json({
            token,
            vendor: {
                id: vendor._id,
                vendorId: vendor.vendorId,
                name: vendor.name,
                enterpriseName: vendor.enterpriseName,
                email: vendor.email,
            },
        });
    } catch (err) {
        console.error("Vendor Login Error:", err);
        return res.status(500).json({
            error: "Failed to login vendor",
        });
    }
};
