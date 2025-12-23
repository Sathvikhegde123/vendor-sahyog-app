import Employee from "../models/Employee.js";

export const createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create({
      ...req.body,
      vendorId: req.vendor._id, // ✅ FIX
    });

    res.status(201).json(employee);
  } catch (err) {
  console.error("Create employee error FULL:", err);
  res.status(500).json({
    error: err.message,
    details: err,
  });
}

};

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({
      vendorId: req.vendor._id, // ✅ FIX
    });

    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const updated = await Employee.findOneAndUpdate(
      {
        _id: req.params.id,
        vendorId: req.vendor._id, // ✅ FIX
      },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update employee" });
  }
};

export const deactivateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOneAndUpdate(
      {
        _id: req.params.id,
        vendorId: req.vendor._id, // ✅ FIX
      },
      { isActive: false },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ message: "Employee deactivated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to deactivate employee" });
  }
};

export const addAttendance = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      vendorId: req.vendor._id, // ✅ FIX
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    employee.attendanceLogs.push(req.body);
    await employee.save();

    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: "Failed to add attendance" });
  }
};

export const addSalary = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      vendorId: req.vendor._id, // ✅ FIX
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    employee.salaryRecords.push(req.body);
    await employee.save();

    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: "Failed to add salary record" });
  }
};

export const addPerformanceIssue = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      vendorId: req.vendor._id, // ✅ FIX
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    employee.performanceIssues.push(req.body);
    await employee.save();

    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: "Failed to add performance issue" });
  }
};

export const assignShift = async (req, res) => {
  try {
    const employee = await Employee.findOneAndUpdate(
      {
        _id: req.params.id,
        vendorId: req.vendor._id, // ✅ FIX
      },
      { shiftAllocation: req.body },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: "Failed to assign shift" });
  }
};
