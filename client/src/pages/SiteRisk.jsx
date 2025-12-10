import PageHeader from "../components/PageHeader";

export default function SiteRisk() {
    return (
        <>
            <PageHeader
                title="Site Risk Management"
                description="Record site risk factors and compute site-wise risk scores."
            />
            <div className="bg-white p-4 rounded shadow">
                Site risk forms, scores, and document uploads.
            </div>
        </>
    );
}
