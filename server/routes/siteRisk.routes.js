import express from "express";
import auth from "../middleware/auth.js";
import moduleAccess from "../middleware/moduleAccess.js";
import { createSiteRisk } from "../controllers/siteRisk.controller.js";

const router = express.Router();

router.post("/", auth, moduleAccess("SITE_RISK"), createSiteRisk);

export default router;
