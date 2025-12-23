import express from "express";
import auth from "../middleware/auth.js";
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

// ALL routes MUST have auth
router.post("/", auth, createEmployee);
router.get("/", auth, getAllEmployees);
router.put("/:id", auth, updateEmployee);
router.put("/:id/deactivate", auth, deactivateEmployee);

router.post("/:id/attendance", auth, addAttendance);
router.post("/:id/salary", auth, addSalary);
router.post("/:id/performance-issue", auth, addPerformanceIssue);
router.put("/:id/shift", auth, assignShift);

export default router;
