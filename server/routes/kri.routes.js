import express from "express";
import vendorAuth from "../middleware/auth.js";
import moduleAccess from "../middleware/moduleAccess.js";
import { createKRI } from "../controllers/kri.controller.js";

const router = express.Router();

router.post("/", vendorAuth, moduleAccess("KRI"), createKRI);

export default router;
