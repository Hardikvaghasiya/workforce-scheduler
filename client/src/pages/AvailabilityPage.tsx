import { useEffect, useState } from "react";
import { api } from "../services/api";

type Employee = {
  id: string;
  name: string;
  email: string;
  role: "MANAGER" | "STAFF";
};

type Availability = {
  id: string;
  employeeId: string;
  day: string;
  start: string;
  end: string;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AvailabilityPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

  const [day, setDay] = useState(DAYS[0]);
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");

  const [list, setList] = useState<Availability[]>([]);
  const [msg, setMsg] = useState("");

  async function loadEmployees() {
    const res = await api.get("/employees");
    const data: Employee[] = res.data.data;
    setEmployees(data);

    // Auto-select first employee if none selected
    if (!selectedEmployeeId && data.length > 0) {
      setSelectedEmployeeId(data[0].id);
    }
  }

  async function loadAvailability(employeeId: string) {
    const res = await api.get("/availability", { params: { employeeId } });
    setList(res.data.data);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    try {
      await api.post("/availability", {
        employeeId: selectedEmployeeId,
        day,
        start,
        end,
      });
      setMsg("Availability saved ✅");
      await loadAvailability(selectedEmployeeId);
    } catch (err: any) {
      setMsg(err?.response?.data?.error || "Failed to save availability");
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployeeId) loadAvailability(selectedEmployeeId);
  }, [selectedEmployeeId]);

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 16 }}>
      <h2>Availability</h2>

      {employees.length === 0 ? (
        <p>Add employees first.</p>
      ) : (
        <>
          <div style={{ marginTop: 12 }}>
            <label>Employee: </label>
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.role})
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleAdd} style={{ display: "grid", gap: 8, marginTop: 12 }}>
            <select value={day} onChange={(e) => setDay(e.target.value)}>
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <div style={{ display: "flex", gap: 8 }}>
              <input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
              <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>

            <button type="submit">Save Availability</button>
            {msg && <p>{msg}</p>}
          </form>

          <hr style={{ margin: "16px 0" }} />

          <h3>Saved Availability</h3>
          {list.length === 0 ? (
            <p>No availability saved yet.</p>
          ) : (
            <ul>
              {list.map((a) => (
                <li key={a.id}>
                  {a.day}: {a.start} - {a.end}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}