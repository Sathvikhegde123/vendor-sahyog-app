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

const router = express.Router();

router.post("/", vendorAuth, createAudit);
router.get("/", vendorAuth, getMyAudits);
router.get("/:id", vendorAuth, getAuditById);
router.put("/:id", vendorAuth, updateAudit);
router.delete("/:id", vendorAuth, deleteAudit);

router.post("/:id/findings", vendorAuth, addFinding);
router.put("/:id/status", vendorAuth, updateAuditStatus);

export default router;
