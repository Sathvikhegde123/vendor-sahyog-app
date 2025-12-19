import express from "express";
import auth from "../middleware/auth.js";
import { createKRI } from "../controllers/kri.controller.js";

const router = express.Router();

// VendorAdmin & Admin allowed
router.post("/", auth, createKRI);

export default router;
