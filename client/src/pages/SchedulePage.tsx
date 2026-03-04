// client/src/pages/SchedulePage.tsx
import { useEffect, useMemo, useState } from "react";
import { getEmployees, getShifts } from "../services/api";

/**
 * Types (match your API shapes)
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
  day: string;   // "Mon", "Tue", ...
  start: string; // "09:00"
  end: string;   // "17:00"
  createdAt?: string;
};

/**
 * Week columns
 */
const DAYS: Array<Shift["day"]> = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 * Small UI helpers (no external UI library)
 */
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      {children}
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
      {children}
    </span>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-800 shadow-sm">
      {children}
    </span>
  );
}

/**
 * Converts "09:00" -> "9:00" for nicer display
 */
function prettyTime(t: string) {
  const [h, m] = t.split(":");
  const hh = String(Number(h)); // remove leading zeros
  return `${hh}:${m}`;
}

export default function SchedulePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Optional filters to make UI more useful
  const [roleFilter, setRoleFilter] = useState<"ALL" | "MANAGER" | "STAFF">("ALL");
  const [search, setSearch] = useState("");

  /**
   * Load employees + shifts once when page opens
   */
  async function load() {
    setLoading(true);
    setError("");
    try {
      const [emps, s] = await Promise.all([getEmployees(), getShifts()]);
      setEmployees(emps);
      setShifts(s);
    } catch (e) {
      setError("Failed to load schedule. Check if API is running on :5050");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  /**
   * Build a map: shiftsByEmployeeDay[employeeId][day] => Shift[]
   * This makes rendering the grid fast and clean.
   */
  const shiftsByEmployeeDay = useMemo(() => {
    const map: Record<string, Record<string, Shift[]>> = {};
    for (const emp of employees) {
      map[emp.id] = {};
      for (const d of DAYS) map[emp.id][d] = [];
    }

    for (const s of shifts) {
      if (!map[s.employeeId]) continue; // skip if employee deleted
      if (!map[s.employeeId][s.day]) map[s.employeeId][s.day] = [];
      map[s.employeeId][s.day].push(s);
    }

    // Sort shifts inside each cell by start time
    for (const empId of Object.keys(map)) {
      for (const d of Object.keys(map[empId])) {
        map[empId][d].sort((a, b) => a.start.localeCompare(b.start));
      }
    }

    return map;
  }, [employees, shifts]);

  /**
   * Filter employees by role + search
   */
  const filteredEmployees = useMemo(() => {
    const q = search.trim().toLowerCase();

    return employees.filter((e) => {
      const roleOk = roleFilter === "ALL" ? true : e.role === roleFilter;
      const searchOk =
        q.length === 0
          ? true
          : e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q);

      return roleOk && searchOk;
    });
  }, [employees, roleFilter, search]);

  /**
   * Quick counts for header
   */
  const totalShifts = shifts.length;
  const totalEmployees = employees.length;

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-3xl font-semibold text-gray-900">Schedule</div>
            <div className="mt-1 text-sm text-gray-600">
              Weekly grid view. This is what real managers want to see.
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            <Badge>{totalEmployees} employees</Badge>
            <Badge>{totalShifts} shifts</Badge>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <div className="text-xs font-semibold text-gray-600">Search</div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email…"
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-gray-900/10"
            />
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-600">Role</div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-gray-900/10"
            >
              <option value="ALL">All</option>
              <option value="MANAGER">Managers</option>
              <option value="STAFF">Staff</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={load}
              className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-900">
            Weekly schedule grid
          </div>
          <div className="text-xs text-gray-500">
            Tip: Add shifts in the Shifts page, then come back here.
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-4 text-sm text-gray-600">Loading…</div>
        ) : filteredEmployees.length === 0 ? (
          <div className="mt-4 text-sm text-gray-600">
            No employees match your filters.
          </div>
        ) : (
          <div className="mt-4 overflow-auto rounded-2xl border border-gray-200">
            {/* Grid header */}
            <div className="min-w-[1000px]">
              <div
                className="grid border-b border-gray-200 bg-gray-50"
                style={{ gridTemplateColumns: "280px repeat(7, 1fr)" }}
              >
                <div className="p-4 text-xs font-semibold text-gray-600">Employee</div>
                {DAYS.map((d) => (
                  <div key={d} className="p-4 text-xs font-semibold text-gray-600">
                    {d}
                  </div>
                ))}
              </div>

              {/* Grid rows */}
              {filteredEmployees.map((emp) => (
                <div
                  key={emp.id}
                  className="grid border-b border-gray-100"
                  style={{ gridTemplateColumns: "280px repeat(7, 1fr)" }}
                >
                  {/* Employee cell */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-gray-900">
                          {emp.name}
                        </div>
                        <div className="truncate text-xs text-gray-600">{emp.email}</div>
                      </div>
                      <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                        {emp.role}
                      </span>
                    </div>
                  </div>

                  {/* Day cells */}
                  {DAYS.map((d) => {
                    const cellShifts = shiftsByEmployeeDay?.[emp.id]?.[d] || [];
                    const empty = cellShifts.length === 0;

                    return (
                      <div
                        key={d}
                        className={[
                          "p-3",
                          "border-l border-gray-100",
                          empty ? "bg-white" : "bg-gray-50",
                        ].join(" ")}
                      >
                        {empty ? (
                          <div className="text-xs text-gray-400">—</div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            {cellShifts.map((s) => (
                              <div
                                key={s.id}
                                className="rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="text-xs font-semibold text-gray-900">
                                    {prettyTime(s.start)} → {prettyTime(s.end)}
                                  </div>
                                  <Pill>Shift</Pill>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}