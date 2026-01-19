import express from "express";
import vendorAuth from "../middleware/auth.js";
import {
  createAudit,
  getMyAudits,
  getAuditById,
  updateAudit,
  deleteAudit,
  addFinding,
  updateAuditStatus
} from "../controllers/internalAudit.controller.js";
import moduleAccess from "../middleware/moduleAccess.js";

const router = express.Router();

router.post("/", vendorAuth, moduleAccess("INTERNAL_AUDIT"), createAudit);
router.get("/", vendorAuth, moduleAccess("INTERNAL_AUDIT"), getMyAudits);
router.get("/:id", vendorAuth, moduleAccess("INTERNAL_AUDIT"), getAuditById);
router.put("/:id", vendorAuth, moduleAccess("INTERNAL_AUDIT"), updateAudit);
router.delete("/:id", vendorAuth, moduleAccess("INTERNAL_AUDIT"), deleteAudit);
router.post("/:id/findings", vendorAuth, moduleAccess("INTERNAL_AUDIT"), addFinding);
router.put("/:id/status", vendorAuth, moduleAccess("INTERNAL_AUDIT"), updateAuditStatus);

export default router;
