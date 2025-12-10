import PageHeader from "../components/PageHeader";

export default function LicenseRenewals() {
    return (
        <>
            <PageHeader
                title="License Renewals"
                description="Track licenses, expiry reminders, and renewals."
            />
            <div className="bg-white p-4 rounded shadow">
                License repository & reminder settings.
            </div>
        </>
    );
}
