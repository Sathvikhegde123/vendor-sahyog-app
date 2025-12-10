import PageHeader from "../components/PageHeader";

export default function Home() {
    return (
        <>
            <PageHeader
                title="Dashboard Overview"
                description="Real-time view of enterprise risks, audits, and compliance status."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {["KRIs", "Licenses", "Audits"].map(card => (
                    <div key={card} className="bg-white p-4 rounded shadow">
                        <h3 className="font-semibold">{card}</h3>
                        <p className="text-sm text-gray-500">Summary metrics</p>
                    </div>
                ))}
            </div>
        </>
    );
}
