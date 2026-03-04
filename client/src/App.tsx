// client/src/App.tsx
import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

import EmployeesPage from "./pages/EmployeesPage";
import AvailabilityPage from "./pages/AvailabilityPage";
import ShiftsPage from "./pages/ShiftsPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/employees" replace />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/availability" element={<AvailabilityPage />} />
        <Route path="/shifts" element={<ShiftsPage />} />
      </Routes>
    </Layout>
  );
}