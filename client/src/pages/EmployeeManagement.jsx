import { useEffect, useState } from "react";
import axios from "axios";
import PageHeader from "../components/PageHeader";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeFormModal from "../components/EmployeeFormModal";
import api from "../utils/api";

export default function EmployeeManagement() {
    const [employees, setEmployees] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [search, setSearch] = useState("");

    const fetchEmployees = async () => {
        const res = await api.get("/employees");
        setEmployees(res.data);
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const filteredEmployees = employees.filter(e =>
        e.employeeName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <PageHeader
                title="Employee Management"
                description="Centralized management of employee records, compliance, attendance and payroll."
            />

            <div className="bg-white rounded-lg shadow p-6 space-y-6">

                {/* Toolbar */}
                <div className="flex justify-between items-center">
                    <input
                        className="border rounded px-4 py-2 w-72"
                        placeholder="Search employee..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />

                    <button
                        onClick={() => {
                            setSelectedEmployee(null);
                            setOpenForm(true);
                        }}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        + Add Employee
                    </button>
                </div>

                <EmployeeTable
                    employees={filteredEmployees}
                    onEdit={(emp) => {
                        setSelectedEmployee(emp);
                        setOpenForm(true);
                    }}
                    onRefresh={fetchEmployees}
                />
            </div>

            {openForm && (
                <EmployeeFormModal
                    employee={selectedEmployee}
                    onClose={() => setOpenForm(false)}
                    onSuccess={fetchEmployees}
                />
            )}
        </>
    );
}
