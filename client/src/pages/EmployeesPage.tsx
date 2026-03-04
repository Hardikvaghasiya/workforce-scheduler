import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Badge, Button, Card, Input, Select, Sub, Title } from "../components/ui";

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

  async function loadEmployees() {
    const res = await api.get("/employees");
    setEmployees(res.data.data);
  }

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
    <div className="space-y-4">
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <Title>Employees</Title>
            <Sub>Add staff/managers. Used for availability + scheduling.</Sub>
          </div>
          <Badge>{employees.length} total</Badge>
        </div>

        <form onSubmit={handleAdd} className="mt-4 grid gap-3 md:grid-cols-3">
          <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Select value={role} onChange={(e) => setRole(e.target.value as Employee["role"])}>
            <option value="STAFF">STAFF</option>
            <option value="MANAGER">MANAGER</option>
          </Select>

          <div className="md:col-span-3 flex items-center gap-3">
            <Button type="submit">Add employee</Button>
            {msg && <span className="text-sm text-gray-700">{msg}</span>}
          </div>
        </form>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Employee list</h3>
          <span className="text-xs text-gray-500">In-memory (DB later)</span>
        </div>

        <div className="mt-3 divide-y rounded-2xl border">
          {employees.length === 0 ? (
            <div className="p-4 text-sm text-gray-600">No employees yet.</div>
          ) : (
            employees.map((emp) => (
              <div key={emp.id} className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium text-gray-900">{emp.name}</div>
                  <div className="text-sm text-gray-600">{emp.email}</div>
                </div>
                <Badge>{emp.role}</Badge>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}