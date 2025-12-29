import Billing from "../models/moduleBilling.js";

/**
 * Vendor purchases a module
 * (Later Admin can also do this)
 */
export const purchaseModule = async (req, res) => {
  try {
    const vendorId = req.vendor._id;

    const {
      moduleCode,
      moduleName,
      pricing,
      licenseDurationMonths,
    } = req.body;

    if (!moduleCode || !moduleName || !licenseDurationMonths) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + licenseDurationMonths);

    const billing = await Billing.create({
      vendorId,
      moduleCode,
      moduleName,
      pricing,
      license: {
        startDate,
        endDate,
        status: "ACTIVE",
      },
      payment: {
        paymentStatus: "SUCCESS",
        paidAt: new Date(),
      },
    });

    res.status(201).json({
      message: "Module purchased successfully",
      billing,
    });
  } catch (err) {
    console.error("Billing Error:", err);
    res.status(500).json({ error: "Failed to purchase module" });
  }
};

/**
 * Vendor sees all purchased modules
 */
export const getMyModules = async (req, res) => {
  try {
    const vendorId = req.vendor._id;

    const modules = await Billing.find({ vendorId });

    res.json(modules);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch modules" });
  }
};

/**
 * Check if vendor has access to a module
 * Used internally by RBAC middleware
 */
export const checkModuleAccess = async (vendorId, moduleCode) => {
  const record = await Billing.findOne({
    vendorId,
    moduleCode,
    "license.status": "ACTIVE",
    "license.endDate": { $gte: new Date() },
  });

  return !!record;
};
