import Billing from "../models/moduleBilling.js";

const moduleAccess = (moduleCode) => {
  return async (req, res, next) => {
    try {
      const vendorId = req.vendor._id;

      const billing = await Billing.findOne({
        vendorId,
        moduleCode,
        "license.status": "ACTIVE",
        "license.endDate": { $gte: new Date() }, // 🔥 expiry check
      });

      if (!billing) {
        return res.status(403).json({
          error: `Access denied. ${moduleCode} not purchased or license expired.`,
        });
      }

      // Optional: attach billing info
      req.billing = billing;

      next();
    } catch (err) {
      return res.status(500).json({
        error: "Billing access check failed",
      });
    }
  };
};

export default moduleAccess;
