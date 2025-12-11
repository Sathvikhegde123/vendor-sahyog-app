import { useState } from "react";
import axios from "axios";
import api from "../utils/api";

export default function EmployeeFormModal({ employee, onClose, onSuccess }) {
    const [form, setForm] = useState({
        employeeName: employee?.employeeName || "",
        employeeEmail: employee?.employeeEmail || "",
        employeePhone: employee?.employeePhone || "",
        role: employee?.role || "Staff",
    });

    const submit = async () => {
        if (employee) {
            await api.put(`/employees/${employee._id}`, form);
        } else {
            await api.post("/employees", form);
        }
        onSuccess();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white w-[420px] rounded-lg shadow p-6 space-y-4">
                <h2 className="text-lg font-semibold text-slate-700">
                    {employee ? "Edit Employee" : "Add Employee"}
                </h2>

                <input
                    className="border p-2 w-full rounded"
                    placeholder="Employee Name"
                    value={form.employeeName}
                    onChange={e => setForm({ ...form, employeeName: e.target.value })}
                />

                <input
                    className="border p-2 w-full rounded"
                    placeholder="Email"
                    value={form.employeeEmail}
                    onChange={e => setForm({ ...form, employeeEmail: e.target.value })}
                />

                <input
                    className="border p-2 w-full rounded"
                    placeholder="Phone"
                    value={form.employeePhone}
                    onChange={e => setForm({ ...form, employeePhone: e.target.value })}
                />

                <select
                    className="border p-2 w-full rounded"
                    value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value })}
                >
                    <option>Staff</option>
                    <option>Manager</option>
                    <option>Admin</option>
                    <option>Viewer</option>
                </select>

                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 border rounded">
                        Cancel
                    </button>
                    <button
                        onClick={submit}
                        className="px-4 py-2 bg-indigo-600 text-white rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
