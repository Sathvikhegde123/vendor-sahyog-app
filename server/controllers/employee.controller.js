import Employee from "../models/Employee.js";

export const createEmployee = async (req, res) => {
    try {
        const employee = await Employee.create(req.body);
        res.status(201).json(employee);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getAllEmployees = async (req, res) => {
    const employees = await Employee.find({ isActive: true }).populate("vendorId");
    res.json(employees);
};

export const updateEmployee = async (req, res) => {
    const updated = await Employee.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(updated);
};

export const deactivateEmployee = async (req, res) => {
    await Employee.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: "Employee deactivated" });
};

export const addAttendance = async (req, res) => {
    const employee = await Employee.findById(req.params.id);
    employee.attendanceLogs.push(req.body);
    await employee.save();
    res.json(employee);
};

export const addSalary = async (req, res) => {
    const employee = await Employee.findById(req.params.id);
    employee.salaryRecords.push(req.body);
    await employee.save();
    res.json(employee);
};

export const addPerformanceIssue = async (req, res) => {
    const employee = await Employee.findById(req.params.id);
    employee.performanceIssues.push(req.body);
    await employee.save();
    res.json(employee);
};

export const assignShift = async (req, res) => {
    const employee = await Employee.findByIdAndUpdate(
        req.params.id,
        { shiftAllocation: req.body },
        { new: true }
    );
    res.json(employee);
};
