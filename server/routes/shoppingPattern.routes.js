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

const router = express.Router();

// Dashboard and analytics endpoints
router.get("/dashboard", vendorAuth, getDashboardStats);
router.get("/category-analysis", vendorAuth, getCategoryAnalysis);
router.get("/peak-hours", vendorAuth, getPeakHoursAnalysis);
router.get("/location-analysis", vendorAuth, getLocationAnalysis);
router.get("/payment-method", vendorAuth, getPaymentMethodAnalysis);
router.get("/purchase-channel", vendorAuth, getPurchaseChannelAnalysis);
router.get("/time-trends", vendorAuth, getTimeTrends);
router.get("/customer-behavior", vendorAuth, getCustomerBehaviorAnalysis);

// Pattern generation and retrieval
router.post("/generate", vendorAuth, generateShoppingPatterns);
router.get("/saved", vendorAuth, getSavedPatterns);

export default router;
