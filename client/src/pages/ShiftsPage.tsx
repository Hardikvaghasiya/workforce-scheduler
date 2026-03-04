// client/src/pages/ShiftsPage.tsx
import { useEffect, useMemo, useState } from "react";
import { addShift, deleteShift, getEmployees, getShifts } from "../services/api";

/**
 * Types
 */
type Employee = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type Shift = {
  id: string;
  employeeId: string;
  day: string;
  start: string;
  end: string;
  createdAt?: string;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 * Small UI helpers (simple, no extra library)
 */
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-semibold text-gray-600">{children}</div>;
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-gray-900/10"
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-gray-900/10"
    />
  );
}

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
    />
  );
}

function GhostButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
    />
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
      {children}
    </span>
  );
}

export default function ShiftsPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [employeeId, setEmployeeId] = useState("");
  const [day, setDay] = useState("Mon");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");

  // UI messages
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const employeeMap = useMemo(() => {
    const map: Record<string, Employee> = {};
    for (const e of employees) map[e.id] = e;
    return map;
  }, [employees]);

  async function loadAll() {
    setLoading(true);
    setError("");
    try {
      const [emps, s] = await Promise.all([getEmployees(), getShifts()]);
      setEmployees(emps);
      setShifts(s);

      // choose first employee by default
      if (!employeeId && emps.length > 0) {
        setEmployeeId(emps[0].id);
      }
    } catch (e: any) {
      setError("Failed to load shifts/employees");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreateShift() {
    setError("");
    setOk("");

    try {
      await addShift({ employeeId, day, start, end });
      setOk("Shift created ✅");
      const s = await getShifts();
      setShifts(s);
    } catch (e: any) {
      // Backend sends useful message in error.response.data.error
      const msg =
        e?.response?.data?.error ||
        "Failed to create shift (check server + availability rules)";
      setError(msg);
    }
  }

  async function onDeleteShift(id: string) {
    setError("");
    setOk("");
    try {
      await deleteShift(id);
      const s = await getShifts();
      setShifts(s);
      setOk("Shift deleted ✅");
    } catch {
      setError("Failed to delete shift");
    }
  }

  const shiftsByDay = useMemo(() => {
    const grouped: Record<string, Shift[]> = {};
    for (const d of DAYS) grouped[d] = [];
    for (const s of shifts) {
      if (!grouped[s.day]) grouped[s.day] = [];
      grouped[s.day].push(s);
    }
    // sort by time
    for (const d of Object.keys(grouped)) {
      grouped[d].sort((a, b) => a.start.localeCompare(b.start));
    }
    return grouped;
  }, [shifts]);

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-3xl font-semibold text-gray-900">Shifts</div>
            <div className="mt-1 text-sm text-gray-600">
              Create shifts and block conflicts. A shift must fit inside the
              employee’s availability.
            </div>
          </div>
          <Badge>{shifts.length} scheduled</Badge>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <Label>Employee</Label>
            <div className="mt-2">
              <Select
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              >
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} ({e.role})
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <Label>Day</Label>
            <div className="mt-2">
              <Select value={day} onChange={(e) => setDay(e.target.value)}>
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <Label>Quick presets</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              <GhostButton onClick={() => (setStart("07:00"), setEnd("15:00"))}>
                Morning 07–15
              </GhostButton>
              <GhostButton onClick={() => (setStart("09:00"), setEnd("17:00"))}>
                Day 09–17
              </GhostButton>
              <GhostButton onClick={() => (setStart("14:00"), setEnd("22:00"))}>
                Evening 14–22
              </GhostButton>
            </div>
          </div>

          <div>
            <Label>Start</Label>
            <div className="mt-2">
              <Input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
          </div>

          <div>
            <Label>End</Label>
            <div className="mt-2">
              <Input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </div>

          <div className="flex items-end">
            <Button
              onClick={onCreateShift}
              disabled={!employeeId || loading}
              title="Create shift (checks availability + conflicts)"
            >
              Create shift
            </Button>
          </div>

          <div className="md:col-span-4">
            {error && (
              <div className="mt-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {ok && (
              <div className="mt-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {ok}
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-900">
            Weekly scheduled shifts
          </div>
          <div className="text-xs text-gray-500">
            Conflicts are blocked by API rules
          </div>
        </div>

        {loading ? (
          <div className="mt-4 text-sm text-gray-600">Loading…</div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {DAYS.map((d) => (
              <div key={d} className="rounded-2xl border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-900">{d}</div>
                  <Badge>{shiftsByDay[d].length}</Badge>
                </div>

                {shiftsByDay[d].length === 0 ? (
                  <div className="mt-3 text-sm text-gray-500">
                    No shifts scheduled
                  </div>
                ) : (
                  <div className="mt-3 space-y-2">
                    {shiftsByDay[d].map((s) => {
                      const emp = employeeMap[s.employeeId];
                      return (
                        <div
                          key={s.id}
                          className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3"
                        >
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-gray-900">
                              {emp ? emp.name : "Unknown employee"}
                            </div>
                            <div className="text-xs text-gray-600">
                              {s.start} → {s.end}
                            </div>
                          </div>

                          <GhostButton onClick={() => onDeleteShift(s.id)}>
                            Delete
                          </GhostButton>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}