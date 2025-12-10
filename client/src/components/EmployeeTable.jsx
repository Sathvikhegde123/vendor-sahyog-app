import EmployeeActions from "./EmployeeActions";

export default function EmployeeTable({ employees, onEdit, onRefresh }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm border">
                <thead className="bg-slate-100 text-slate-700">
                    <tr>
                        <th className="p-3 text-left">Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Shift</th>
                        <th>Status</th>
                        <th className="text-right pr-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(emp => (
                        <tr key={emp._id} className="border-t hover:bg-slate-50">
                            <td className="p-3 font-medium">{emp.employeeName}</td>
                            <td>{emp.employeeEmail}</td>
                            <td>{emp.role}</td>
                            <td>{emp.shiftAllocation?.shiftName || "—"}</td>
                            <td>
                                <span className={`px-2 py-1 rounded text-xs ${emp.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    }`}>
                                    {emp.isActive ? "Active" : "Inactive"}
                                </span>
                            </td>
                            <td className="text-right">
                                <EmployeeActions
                                    employee={emp}
                                    onEdit={onEdit}
                                    onRefresh={onRefresh}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
