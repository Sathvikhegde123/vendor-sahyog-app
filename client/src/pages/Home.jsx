import { useEffect, useState } from "react";
import api from "../utils/api" // adjust path if needed

export default function Home() {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const res = await api.get("/billing/my-modules");
                setModules(res.data);
            } catch (err) {
                console.error("Failed to fetch modules", err);
            } finally {
                setLoading(false);
            }
        };

        fetchModules();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100">
                <p className="text-gray-600 text-lg">Loading your modules...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                    Purchased Modules
                </h1>

                {modules.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl shadow text-center text-gray-500">
                        No active modules found.
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {modules.map((mod) => (
                            <div
                                key={mod._id}
                                className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6 flex flex-col"
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            {mod.moduleName}
                                        </h2>
                                        <p className="text-xs text-gray-500">
                                            Code: {mod.moduleCode}
                                        </p>
                                    </div>

                                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                                        {mod.license.status}
                                    </span>
                                </div>

                                {/* Pricing */}
                                <div className="text-sm text-gray-700 mb-3">
                                    <p className="font-medium">Pricing</p>
                                    <p>
                                        ₹{mod.pricing.amount} /{" "}
                                        {mod.pricing.billingCycle}
                                    </p>
                                </div>

                                {/* License */}
                                <div className="text-sm text-gray-700 mb-3">
                                    <p className="font-medium">License Validity</p>
                                    <p>
                                        {new Date(mod.license.startDate).toLocaleDateString()}{" "}
                                        –{" "}
                                        {new Date(mod.license.endDate).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Payment */}
                                <div className="text-sm text-gray-700 mb-4">
                                    <p className="font-medium">Payment</p>
                                    <p>Status: {mod.payment.paymentStatus}</p>
                                    <p>
                                        Paid on{" "}
                                        {new Date(mod.payment.paidAt).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Footer */}
                                <div className="mt-auto pt-4 border-t text-xs text-gray-500">
                                    Purchased on{" "}
                                    {new Date(mod.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
