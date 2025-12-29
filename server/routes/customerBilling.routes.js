import express from "express";
import vendorAuth from "../middleware/auth.js";
import {
  createCustomerBill,
  getMyCustomerBills,
  getCustomerBillById,
  updateCustomerBill,
  deleteCustomerBill,
} from "../controllers/customerBilling.controller.js";

const router = express.Router();

router.post("/", vendorAuth, createCustomerBill);
router.get("/", vendorAuth, getMyCustomerBills);
router.get("/:id", vendorAuth, getCustomerBillById);
router.put("/:id", vendorAuth, updateCustomerBill);
router.delete("/:id", vendorAuth, deleteCustomerBill);

export default router;
