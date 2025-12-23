import express from "express";
import vendorAuth from "../middleware/auth.js";
import {
  purchaseModule,
  getMyModules,
} from "../controllers/billing.controller.js";

const router = express.Router();

// Vendor purchases a module
router.post("/purchase", vendorAuth, purchaseModule);

// Vendor views purchased modules
router.get("/my-modules", vendorAuth, getMyModules);

export default router;
