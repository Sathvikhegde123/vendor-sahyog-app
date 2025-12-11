import { useState } from "react";
import axios from "axios";
import ConfirmDialog from "./ConfirmDialog";
import api from "../utils/api";

export default function EmployeeActions({ employee, onEdit, onRefresh }) {
    const [openConfirm, setOpenConfirm] = useState(false);

    const deactivate = async () => {
        await api.put(`/employees/${employee._id}/deactivate`);
        setOpenConfirm(false);
        onRefresh();
    };

    return (
        <>
            <div className="flex justify-end gap-3 pr-4">
                <button
                    onClick={() => onEdit(employee)}
                    className="text-indigo-600 hover:underline"
                >
                    Edit
                </button>

                <button
                    onClick={() => setOpenConfirm(true)}
                    className="text-red-600 hover:underline"
                >
                    Deactivate
                </button>
            </div>

            <ConfirmDialog
                open={openConfirm}
                title="Deactivate Employee"
                message={`Are you sure you want to deactivate ${employee.employeeName}?`}
                confirmText="Deactivate"
                type="danger"
                onCancel={() => setOpenConfirm(false)}
                onConfirm={deactivate}
            />
        </>
    );
}
