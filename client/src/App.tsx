import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import EmployeesPage from "./pages/EmployeesPage";
import AvailabilityPage from "./pages/AvailabilityPage";

function ShiftsPlaceholder() {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Shifts</h2>
      <p className="mt-2 text-sm text-gray-600">
        Next: schedule shifts + show conflict warnings.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/employees" replace />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/availability" element={<AvailabilityPage />} />
        <Route path="/shifts" element={<ShiftsPlaceholder />} />
      </Routes>
    </Layout>
  );
}