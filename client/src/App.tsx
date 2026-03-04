import { Route, Routes, Link } from "react-router-dom";
import EmployeesPage from "./pages/EmployeesPage";

export default function App() {
  return (
    <div>
      <nav style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
        <Link to="/employees">Employees</Link>
      </nav>

      <Routes>
        <Route path="/" element={<EmployeesPage />} />
        <Route path="/employees" element={<EmployeesPage />} />
      </Routes>
    </div>
  );
}