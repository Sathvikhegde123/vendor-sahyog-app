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

router.post("/", createEmployee);
router.get("/", getAllEmployees);
router.put("/:id", updateEmployee);
router.put("/:id/deactivate", deactivateEmployee);

router.post("/:id/attendance", addAttendance);
router.post("/:id/salary", addSalary);
router.post("/:id/performance-issue", addPerformanceIssue);
router.put("/:id/shift", assignShift);

export default router;
