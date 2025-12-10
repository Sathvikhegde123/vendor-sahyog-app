import { NavLink } from "react-router-dom";

const links = [
    { name: "Dashboard", path: "/" },
    { name: "Risk Assessment (KRI)", path: "/risk-assessment" },
    { name: "Site Risk", path: "/site-risk" },
    { name: "Shopping Patterns", path: "/shopping-patterns" },
    { name: "License Renewals", path: "/license-renewals" },
    { name: "Employees", path: "/employees" },
    { name: "Billing", path: "/billing" },
    { name: "BCP", path: "/bcp" },
    { name: "Internal Audit", path: "/internal-audit" },
];

export default function Sidebar() {
    return (
        <aside className="w-64 bg-gray-900 text-white">
            <div className="p-4 font-bold text-xl border-b border-gray-700">
                RiskOps
            </div>

            <nav className="flex flex-col p-2 gap-1">
                {links.map(link => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            `px-3 py-2 rounded text-sm ${isActive
                                ? "bg-blue-600"
                                : "hover:bg-gray-700"
                            }`
                        }
                    >
                        {link.name}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
