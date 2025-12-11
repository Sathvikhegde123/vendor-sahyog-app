import express from "express";
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

import auth from "../middleware/auth.js";

router.post("/", auth, createEmployee);
router.get("/", auth, getAllEmployees);
router.put("/:id", auth, updateEmployee);
router.put("/:id/deactivate", auth, deactivateEmployee);

router.post("/:id/attendance", addAttendance);
router.post("/:id/salary", addSalary);
router.post("/:id/performance-issue", addPerformanceIssue);
router.put("/:id/shift", assignShift);

export default router;
