import mongoose from "mongoose";

import InternalAudit from "../models/InternalAuditModule.js";
import Employee from "../models/Employee.js";

//
// CREATE AUDIT
//
export const createAudit = async (req, res) => {
  console.log("RAW BODY RECEIVED >>>", req.body);

  try {
    const vendorId = req.vendor._id;

    console.log("\n===== CREATE AUDIT DEBUG =====");
    console.log("Vendor from token:", vendorId);

    const { auditors = [], auditOwner, findings = [] } = req.body;

    console.log("Auditors from body:", auditors);
    console.log("Audit Owner:", auditOwner);

    const findingOwners = findings.map(f => f?.owner).filter(Boolean);
    console.log("Finding Owners:", findingOwners);

    // Normalize & filter IDs
   const employeeIds = Array.from(
  new Set([
    ...auditors,
    auditOwner,
    ...findings.map(f => f.owner)
  ].filter(Boolean))
);

    console.log("Final Employee IDs considered:", employeeIds);

    // Validate employees belong to vendor
    const validEmployees = await Employee.find({
      _id: { $in: employeeIds },
      vendorId: vendorId
    }).select("_id vendorId employeeName");

    console.log("Employees found in DB:", validEmployees);

    if (validEmployees.length !== employeeIds.length) {
      console.log("❌ Vendor mismatch detected");
      return res.status(400).json({
        error: "One or more employees do not belong to this vendor",
        debug: {
          expectedVendor: vendorId,
          employeeIdsSent: employeeIds,
          employeesMatched: validEmployees
        }
      });
    }

    console.log("✅ Employee validation passed");

    const audit = await InternalAudit.create({
      ...req.body,
      vendorId
    });

    console.log("🔥 Audit Created:", audit._id);

    res.status(201).json(audit);

  } catch (err) {
    console.error("Create audit error:", err);
    res.status(500).json({ error: err.message });
  }
};

//
// GET ALL AUDITS (Vendor Scoped)
//
export const getMyAudits = async (req, res) => {
  try {
    const audits = await InternalAudit.find({
      vendorId: req.vendor._id
    }).sort({ createdAt: -1 });

    res.json(audits);
  } catch (err) {
    console.error("Fetch audits error:", err);
    res.status(500).json({ error: "Failed to fetch audits" });
  }
};


//
// GET SINGLE AUDIT
//
export const getAuditById = async (req, res) => {
  try {
    const audit = await InternalAudit.findOne({
      _id: req.params.id,
      vendorId: req.vendor._id
    });

    if (!audit) return res.status(404).json({ error: "Audit not found" });

    res.json(audit);
  } catch (err) {
    console.error("Get audit error:", err);
    res.status(500).json({ error: "Failed to fetch audit" });
  }
};


//
// UPDATE AUDIT (Vendor Scoped + Employee Check)
//
export const updateAudit = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const { auditors = [], auditOwner, findings = [] } = req.body;

    const employeeIds = [
      ...auditors,
      auditOwner,
      ...findings.map(f => f.owner)
    ].filter(Boolean);

    if (employeeIds.length > 0) {
      const validEmployees = await Employee.find({
        _id: { $in: employeeIds },
        vendorId: vendorId
      });

      if (validEmployees.length !== employeeIds.length) {
        return res.status(400).json({
          error: "Employee does not belong to this vendor"
        });
      }
    }

    const audit = await InternalAudit.findOneAndUpdate(
      { _id: req.params.id, vendorId: vendorId },
      req.body,
      { new: true }
    );

    if (!audit) return res.status(404).json({ error: "Audit not found" });

    res.json(audit);
  } catch (err) {
    console.error("Update audit error:", err);
    res.status(500).json({ error: "Failed to update audit" });
  }
};


//
// DELETE AUDIT
//
export const deleteAudit = async (req, res) => {
  try {
    const result = await InternalAudit.findOneAndDelete({
      _id: req.params.id,
      vendorId: req.vendor._id
    });

    if (!result) return res.status(404).json({ error: "Audit not found" });

    res.json({ message: "Audit deleted" });
  } catch (err) {
    console.error("Delete audit error:", err);
    res.status(500).json({ error: "Failed to delete audit" });
  }
};


//
// ADD FINDING
//
export const addFinding = async (req, res) => {
  try {
    const audit = await InternalAudit.findOne({
      _id: req.params.id,
      vendorId: req.vendor._id
    });

    if (!audit) return res.status(404).json({ error: "Audit not found" });

    audit.findings.push(req.body);
    await audit.save();

    res.json(audit);
  } catch (err) {
    console.error("Add finding error:", err);
    res.status(500).json({ error: "Failed to add finding" });
  }
};


//
// UPDATE STATUS
//
export const updateAuditStatus = async (req, res) => {
  try {
    const audit = await InternalAudit.findOneAndUpdate(
      { _id: req.params.id, vendorId: req.vendor._id },
      { status: req.body.status },
      { new: true }
    );

    if (!audit) return res.status(404).json({ error: "Audit not found" });

    res.json(audit);
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
};
