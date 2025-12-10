export default function ConfirmDialog({
    open,
    title = "Confirm Action",
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "danger", // danger | primary
    onConfirm,
    onCancel,
}) {
    if (!open) return null;

    const color =
        type === "danger"
            ? "bg-red-600 hover:bg-red-700"
            : "bg-indigo-600 hover:bg-indigo-700";

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white w-[420px] rounded-lg shadow-lg p-6 space-y-4">

                <h3 className="text-lg font-semibold text-slate-800">
                    {title}
                </h3>

                <p className="text-sm text-slate-600">
                    {message}
                </p>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border rounded text-slate-700 hover:bg-slate-50"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-white rounded ${color}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
