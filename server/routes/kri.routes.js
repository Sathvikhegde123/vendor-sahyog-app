import express from "express";
import vendorAuth from "../middleware/auth.js";
import { createKRI } from "../controllers/kri.controller.js";

const router = express.Router();

router.post("/", vendorAuth, createKRI);

export default router;
