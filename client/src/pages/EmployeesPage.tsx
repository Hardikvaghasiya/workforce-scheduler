import { useEffect, useState } from "react";
import { api } from "../services/api";

type Employee = {
  id: string;
  name: string;
  email: string;
  role: "MANAGER" | "STAFF";
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Employee["role"]>("STAFF");
  const [msg, setMsg] = useState("");

  // Fetch employees from backend
  async function loadEmployees() {
    const res = await api.get("/employees");
    setEmployees(res.data.data);
  }

  // Add employee to backend
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    try {
      await api.post("/employees", { name, email, role });
      setName("");
      setEmail("");
      setRole("STAFF");
      setMsg("Employee added ✅");
      await loadEmployees();
    } catch (err: any) {
      setMsg(err?.response?.data?.error || "Failed to add employee");
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 16 }}>
      <h2>Employees</h2>

      <form onSubmit={handleAdd} style={{ display: "grid", gap: 8, marginTop: 12 }}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value as any)}>
          <option value="STAFF">STAFF</option>
          <option value="MANAGER">MANAGER</option>
        </select>

        <button type="submit">Add Employee</button>
        {msg && <p>{msg}</p>}
      </form>

      <hr style={{ margin: "16px 0" }} />

      <h3>List</h3>
      {employees.length === 0 ? (
        <p>No employees yet.</p>
      ) : (
        <ul>
          {employees.map((e) => (
            <li key={e.id}>
              <b>{e.name}</b> — {e.email} ({e.role})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}