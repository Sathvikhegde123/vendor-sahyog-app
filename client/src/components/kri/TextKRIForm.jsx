import { useState } from "react";
import { generateKRI } from "../../services/kriService";

export default function TextKRIForm({ onResult }) {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const submit = async () => {
        if (!text.trim()) {
            setError("Please describe your business context before submitting.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const payload = {
                inputMode: "TEXT",
                rawTextInput: text.trim(),
            };

            const res = await generateKRI(payload);
            onResult(res);
        } catch (err) {
            console.error("KRI TEXT MODE ERROR:", err);
            setError(
                err?.response?.data?.error ||
                "Failed to analyze risks. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm max-w-4xl">
            <div>
                <h3 className="text-lg font-semibold text-gray-900">
                    Describe Your Business Context
                </h3>
                <p className="text-sm text-gray-500">
                    Provide a natural-language description of your operations, technology,
                    geography, and data handling.
                </p>
            </div>

            <textarea
                rows={7}
                value={text}
                className="w-full rounded-lg border border-gray-300 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Example: We are a SaaS company operating in India and EU, handling customer and financial data, dependent on AWS and Stripe..."
                onChange={(e) => setText(e.target.value)}
            />

            {error && (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                </p>
            )}

            <button
                onClick={submit}
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white font-medium transition
          ${loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
            >
                {loading ? "Analyzing..." : "Analyze Risks"}
            </button>
        </div>
    );
}
