import express from "express";
import multer from "multer";
import auth from "../middleware/auth.js";
import { uploadAndAnalyzePolicy } from "../controllers/bcmPolicy.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Upload OR text input
router.post(
  "/upload",
  auth,
  upload.single("policyFile"),
  uploadAndAnalyzePolicy
);

export default router;
