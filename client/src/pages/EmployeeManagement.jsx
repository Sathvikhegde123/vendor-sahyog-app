import PageHeader from "../components/PageHeader";

export default function EmployeeManagement() {
    return (
        <>
            <PageHeader
                title="Employee Management"
                description="Manage employee profiles, attendance, shifts, and compliance."
            />
            <div className="bg-white p-4 rounded shadow">
                Employee CRUD & tracking.
            </div>
        </>
    );
}
