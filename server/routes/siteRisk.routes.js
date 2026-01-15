import express from "express";
import vendorAuth from "../middleware/auth.js";
import moduleAccess from "../middleware/moduleAccess.js";
import { createSiteRisk } from "../controllers/siteRisk.controller.js";

const router = express.Router();

router.post("/", vendorAuth, moduleAccess("SITE_RISK"), createSiteRisk);

export default router;
