import express from "express";
import auth from "../middleware/auth.js";
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

router.post("/", auth, createAudit);
router.get("/", auth, getMyAudits);
router.get("/:id", auth, getAuditById);
router.put("/:id", auth, updateAudit);
router.delete("/:id", auth, deleteAudit);

router.post("/:id/findings", auth, addFinding);
router.put("/:id/status", auth, updateAuditStatus);

export default router;
