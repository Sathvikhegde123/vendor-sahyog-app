import { LogOut } from "lucide-react";

export default function Navbar() {
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("vendor");
    window.location.href = "/login";
  };

  return (
    <div className="h-14 bg-white border-b flex items-center px-6 justify-between">
      <h1 className="font-semibold text-lg">
        Enterprise Risk & Compliance Platform
      </h1>
      <button
        onClick={logout}
        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  );
}
