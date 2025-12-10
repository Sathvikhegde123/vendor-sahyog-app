import PageHeader from "../components/PageHeader";

export default function ShoppingPatterns() {
    return (
        <>
            <PageHeader
                title="Customer Shopping Patterns"
                description="Analyze transactions, footfall, and trend insights."
            />
            <div className="bg-white p-4 rounded shadow">
                Charts, heatmaps, and filters.
            </div>
        </>
    );
}
