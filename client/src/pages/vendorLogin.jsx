import { useState } from "react";
import api from "../utils/api";

export default function VendorLogin() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const submit = async () => {
        try {
            const res = await api.post("/auth/vendor/login", form);
            localStorage.setItem("token", res.data.token);
            window.location.href = "/employees";
        } catch (err) {
            setError("Invalid email or password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white w-[420px] p-8 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-slate-800 mb-6">
                    Vendor Login
                </h2>

                {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

                <input
                    className="border p-2 w-full rounded mb-3"
                    placeholder="Email"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <input
                    type="password"
                    className="border p-2 w-full rounded mb-6"
                    placeholder="Password"
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />

                <button
                    onClick={submit}
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                >
                    Login
                </button>
            </div>
        </div>
    );
}
