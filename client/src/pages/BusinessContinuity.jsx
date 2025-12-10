import PageHeader from "../components/PageHeader";

export default function BusinessContinuity() {
    return (
        <>
            <PageHeader
                title="Business Continuity Planning"
                description="BCP workflows, activations, and recovery tracking."
            />
            <div className="bg-white p-4 rounded shadow">
                BCP documents & incident reports.
            </div>
        </>
    );
}
