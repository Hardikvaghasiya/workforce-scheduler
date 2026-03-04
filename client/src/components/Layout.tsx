import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
    isActive ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100",
  ].join(" ");

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div>
            <div className="text-lg font-semibold text-gray-900">Workforce Scheduler</div>
            <div className="text-xs text-gray-500">Employees • Availability • Shifts</div>
          </div>
          <div className="text-xs text-gray-500">
            Local • <span className="font-medium">UI 5173</span> •{" "}
            <span className="font-medium">API 5050</span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-4 px-4 py-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3">
          <div className="rounded-2xl border bg-white p-3 shadow-sm">
            <nav className="space-y-1">
              <NavLink to="/employees" className={linkClass}>
                Employees
              </NavLink>
              <NavLink to="/availability" className={linkClass}>
                Availability
              </NavLink>
              <NavLink to="/shifts" className={linkClass}>
                Shifts
              </NavLink>
              <NavLink to="/schedule">Schedule</NavLink>
            </nav>

            <div className="mt-4 rounded-2xl bg-gray-50 p-3 text-xs text-gray-600">
              <div className="font-medium text-gray-900">Next</div>
              Shift scheduling + conflict warnings.
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="col-span-12 md:col-span-9">{children}</main>
      </div>
    </div>
  );
}