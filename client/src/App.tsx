import { Route, Routes, Link } from "react-router-dom";
import EmployeesPage from "./pages/EmployeesPage";
import AvailabilityPage from "./pages/AvailabilityPage";

export default function App() {
  return (
    <div>
      <nav style={{ padding: 12, borderBottom: "1px solid #ddd", display: "flex", gap: 12 }}>
        <Link to="/employees">Employees</Link>
        <Link to="/availability">Availability</Link>
      </nav>

      <Routes>
        <Route path="/" element={<EmployeesPage />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/availability" element={<AvailabilityPage />} />
      </Routes>
    </div>
  );
}