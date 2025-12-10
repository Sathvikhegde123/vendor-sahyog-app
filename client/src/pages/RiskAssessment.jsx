import PageHeader from "../components/PageHeader";

export default function RiskAssessment() {
    return (
        <>
            <PageHeader
                title="Key Risk Indicators"
                description="Monitor KRIs, thresholds, alerts, and trends."
            />
            <div className="bg-white p-4 rounded shadow">
                KRI Dashboard, alerts & benchmarks will appear here.
            </div>
        </>
    );
}
