import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";

import Home from "./pages/Home";
import RiskAssessment from "./pages/RiskAssessment";
import SiteRisk from "./pages/SiteRisk";
import ShoppingPatterns from "./pages/ShoppingPatterns";
import LicenseRenewals from "./pages/LicenseRenewals";
import EmployeeManagement from "./pages/EmployeeManagement";
import Billing from "./pages/Billing";
import BusinessContinuity from "./pages/BusinessContinuity";
import InternalAudit from "./pages/InternalAudit";

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/risk-assessment" element={<RiskAssessment />} />
        <Route path="/site-risk" element={<SiteRisk />} />
        <Route path="/shopping-patterns" element={<ShoppingPatterns />} />
        <Route path="/license-renewals" element={<LicenseRenewals />} />
        <Route path="/employees" element={<EmployeeManagement />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/bcp" element={<BusinessContinuity />} />
        <Route path="/internal-audit" element={<InternalAudit />} />
      </Route>
    </Routes>
  );
}
