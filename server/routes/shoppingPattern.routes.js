import express from "express";
import vendorAuth from "../middleware/auth.js";
import {
  getDashboardStats,
  getCategoryAnalysis,
  getPeakHoursAnalysis,
  getLocationAnalysis,
  getPaymentMethodAnalysis,
  getPurchaseChannelAnalysis,
  getTimeTrends,
  getCustomerBehaviorAnalysis,
  generateShoppingPatterns,
  getSavedPatterns,
} from "../controllers/shoppingPattern.controller.js";
import moduleAccess from "../middleware/moduleAccess.js";

const router = express.Router();

// Dashboard and analytics endpoints

router.get("/dashboard", vendorAuth, moduleAccess("SHOPPING_PATTERNS"), getDashboardStats);
router.get("/category-analysis", vendorAuth, moduleAccess("SHOPPING_PATTERNS"), getCategoryAnalysis);
router.get("/peak-hours", vendorAuth, moduleAccess("SHOPPING_PATTERNS"), getPeakHoursAnalysis);
router.get("/location-analysis", vendorAuth, moduleAccess("SHOPPING_PATTERNS"), getLocationAnalysis);
router.get("/payment-method", vendorAuth, moduleAccess("SHOPPING_PATTERNS"), getPaymentMethodAnalysis);
router.get("/purchase-channel", vendorAuth, moduleAccess("SHOPPING_PATTERNS"), getPurchaseChannelAnalysis);
router.get("/time-trends", vendorAuth, getTimeTrends);
router.get("/customer-behavior", vendorAuth, getCustomerBehaviorAnalysis);

// Pattern generation and retrieval
router.post("/generate", vendorAuth, generateShoppingPatterns);
router.get("/saved", vendorAuth, getSavedPatterns);

export default router;
