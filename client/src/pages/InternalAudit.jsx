import PageHeader from "../components/PageHeader";

export default function InternalAudit() {
    return (
        <>
            <PageHeader
                title="Internal Audit"
                description="Audit progress, findings, and evidence management."
            />
            <div className="bg-white p-4 rounded shadow">
                Audit tracking dashboard.
            </div>
        </>
    );
}
