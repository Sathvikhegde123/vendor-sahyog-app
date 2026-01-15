import express from "express";
import vendorAuth from "../middleware/auth.js";
import {
  createEmployee,
  getAllEmployees,
  updateEmployee,
  deactivateEmployee,
  addAttendance,
  addSalary,
  addPerformanceIssue,
  assignShift,
} from "../controllers/employee.controller.js";

const router = express.Router();

// ALL routes MUST have vendorAuth
router.post("/", vendorAuth, createEmployee);
router.get("/", vendorAuth, getAllEmployees);
router.put("/:id", vendorAuth, updateEmployee);
router.put("/:id/deactivate", vendorAuth, deactivateEmployee);

router.post("/:id/attendance", vendorAuth, addAttendance);
router.post("/:id/salary", vendorAuth, addSalary);
router.post("/:id/performance-issue", vendorAuth, addPerformanceIssue);
router.put("/:id/shift", vendorAuth, assignShift);

export default router;
