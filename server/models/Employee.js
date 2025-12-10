import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },

  employeeName: {
    type: String,
    required: true,
  },


  employeeEmail: {
    type: String,
    required: true,
    unique: true,
  },
  employeePhone: {
    type: String,
    required: true,
  },

  employeeAddress: {
    type: String,
  },

  joinedDate: {
    type: Date,
    default: Date.now,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  performanceIssues: [
    {
      title: String,
      description: String,
      severity: { type: String, enum: ["Low", "Medium", "High"] },
      date: { type: Date, default: Date.now },
    },
  ],

  complianceViolations: [
    {
      rule: String,
      description: String,
      actionTaken: String,
      date: { type: Date, default: Date.now },
    },
  ],

  shiftAllocation: {
    shiftName: String,
    startTime: String,
    endTime: String,
  },


  role: {
    type: String,
    enum: ["Manager", "Staff", "Admin", "Viewer"],
    default: "Staff",
  }, attendanceLogs: [
    {
      date: Date,
      shift: String,
      status: { type: String, enum: ["Present", "Absent", "Leave"] },
    },
  ],

  salaryRecords: [
    {
      month: String,
      basicPay: Number,
      deductions: Number,
      netPay: Number,
    },
  ],
},
  { timestamps: true }
);

const Employee = mongoose.model("Employee", EmployeeSchema);

export default Employee;

