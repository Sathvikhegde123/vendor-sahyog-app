export default function InputModeToggle({ mode, setMode }) {
    return (
        <div className="flex gap-4">
            {["STRUCTURED", "TEXT"].map((m) => (
                <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-4 py-2 rounded ${mode === m ? "bg-blue-600 text-white" : "bg-gray-200"
                        }`}
                >
                    {m} INPUT
                </button>
            ))}
        </div>
    );
}
