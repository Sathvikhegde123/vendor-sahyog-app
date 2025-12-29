import CustomerBilling from "../models/customerBilling.js";

//
// CREATE BILL
//
export const createCustomerBill = async (req, res) => {
  try {
    const bill = await CustomerBilling.create({
      ...req.body,
      vendorId: req.vendor._id,   // 🔐 tenant binding
    });

    res.status(201).json(bill);
  } catch (err) {
    console.error("Create bill error:", err);
    res.status(500).json({ error: "Failed to create bill" });
  }
};

//
// GET ALL BILLS FOR LOGGED-IN VENDOR
//
export const getMyCustomerBills = async (req, res) => {
  try {
    const bills = await CustomerBilling.find({
      vendorId: req.vendor._id,
    }).sort({ transactionDate: -1 });

    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bills" });
  }
};

//
// GET SINGLE BILL
//
export const getCustomerBillById = async (req, res) => {
  try {
    const bill = await CustomerBilling.findOne({
      _id: req.params.id,
      vendorId: req.vendor._id,
    });

    if (!bill) return res.status(404).json({ error: "Bill not found" });

    res.json(bill);
  } catch {
    res.status(500).json({ error: "Failed to fetch bill" });
  }
};

//
// UPDATE BILL
//
export const updateCustomerBill = async (req, res) => {
  try {
    const bill = await CustomerBilling.findOneAndUpdate(
      { _id: req.params.id, vendorId: req.vendor._id },
      req.body,
      { new: true }
    );

    if (!bill) return res.status(404).json({ error: "Bill not found" });

    res.json(bill);
  } catch {
    res.status(500).json({ error: "Failed to update bill" });
  }
};

//
// DELETE BILL
//
export const deleteCustomerBill = async (req, res) => {
  try {
    const result = await CustomerBilling.findOneAndDelete({
      _id: req.params.id,
      vendorId: req.vendor._id,
    });

    if (!result) return res.status(404).json({ error: "Bill not found" });

    res.json({ message: "Bill deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete bill" });
  }
};
