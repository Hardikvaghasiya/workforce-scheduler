import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { Badge, Button, Card, GhostButton, Input, Select, Sub, Title } from "../components/ui";

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

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const PRESETS = [
  { label: "Morning", start: "07:00", end: "15:00" },
  { label: "Day", start: "09:00", end: "17:00" },
  { label: "Evening", start: "14:00", end: "22:00" },
] as const;

export default function AvailabilityPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  const [day, setDay] = useState<(typeof DAYS)[number]>("Mon");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");

  const [list, setList] = useState<Availability[]>([]);
  const [msg, setMsg] = useState("");

  const selectedEmployee = useMemo(
    () => employees.find((e) => e.id === selectedEmployeeId),
    [employees, selectedEmployeeId]
  );

  async function loadEmployees() {
    const res = await api.get("/employees");
    const data: Employee[] = res.data.data;
    setEmployees(data);
    if (!selectedEmployeeId && data.length > 0) setSelectedEmployeeId(data[0].id);
  }

  async function loadAvailability(employeeId: string) {
    const res = await api.get("/availability", { params: { employeeId } });
    setList(res.data.data);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    try {
      await api.post("/availability", {
        employeeId: selectedEmployeeId,
        day,
        start,
        end,
      });
      setMsg("Saved ✅");
      await loadAvailability(selectedEmployeeId);
    } catch (err: any) {
      setMsg(err?.response?.data?.error || "Failed to save");
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployeeId) loadAvailability(selectedEmployeeId);
  }, [selectedEmployeeId]);

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <Title>Availability</Title>
            <Sub>Set when each employee can work. We use this to auto-check shift conflicts.</Sub>
          </div>
          <Badge>{list.length} saved</Badge>
        </div>

        {employees.length === 0 ? (
          <div className="mt-4 rounded-2xl border bg-gray-50 p-4 text-sm text-gray-700">
            Add employees first.
          </div>
        ) : (
          <form onSubmit={handleSave} className="mt-4 space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <div className="mb-1 text-xs font-medium text-gray-600">Employee</div>
                <Select value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.role})
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <div className="mb-1 text-xs font-medium text-gray-600">Quick presets</div>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <GhostButton
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setStart(p.start);
                        setEnd(p.end);
                      }}
                    >
                      {p.label} {p.start}-{p.end}
                    </GhostButton>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-medium text-gray-600">Day</div>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDay(d)}
                    className={[
                      "rounded-full px-3 py-2 text-sm font-medium border transition",
                      d === day ? "bg-gray-900 text-white border-gray-900" : "bg-white hover:bg-gray-50",
                    ].join(" ")}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <div className="mb-1 text-xs font-medium text-gray-600">Start</div>
                <Input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
              </div>
              <div>
                <div className="mb-1 text-xs font-medium text-gray-600">End</div>
                <Input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={!selectedEmployeeId}>
                Save availability
              </Button>
              {msg && <span className="text-sm text-gray-700">{msg}</span>}
              {selectedEmployee && (
                <span className="ml-auto text-xs text-gray-500">
                  Editing: <span className="font-medium">{selectedEmployee.name}</span>
                </span>
              )}
            </div>
          </form>
        )}
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Saved availability</h3>
          <span className="text-xs text-gray-500">Duplicates will be cleaned next</span>
        </div>

        <div className="mt-3 divide-y rounded-2xl border">
          {list.length === 0 ? (
            <div className="p-4 text-sm text-gray-600">Nothing saved yet.</div>
          ) : (
            list.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Badge>{a.day}</Badge>
                  <div className="text-sm text-gray-800">
                    {a.start} → {a.end}
                  </div>
                </div>
                <span className="text-xs text-gray-500">{a.employeeId.slice(0, 6)}…</span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}