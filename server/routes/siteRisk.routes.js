import express from "express";
import auth from "../middleware/auth.js";
import { createSiteRisk } from "../controllers/siteRisk.controller.js";

const router = express.Router();

router.post("/", auth, createSiteRisk);

export default router;
