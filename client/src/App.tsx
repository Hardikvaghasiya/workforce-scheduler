// client/src/App.tsx
import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

import EmployeesPage from "./pages/EmployeesPage";
import AvailabilityPage from "./pages/AvailabilityPage";
import ShiftsPage from "./pages/ShiftsPage";
import SchedulePage from "./pages/SchedulePage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/employees" replace />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/availability" element={<AvailabilityPage />} />
        <Route path="/shifts" element={<ShiftsPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
      </Routes>
    </Layout>
  );
}