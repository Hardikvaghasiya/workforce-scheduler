import React from "react";

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border bg-white p-5 shadow-sm">{children}</div>;
}

export function Title({ children }: { children: React.ReactNode }) {
  return <h1 className="text-2xl font-semibold text-gray-900">{children}</h1>;
}

export function Sub({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-sm text-gray-600">{children}</p>;
}

export function Button({
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
        "bg-gray-900 text-white hover:bg-black disabled:opacity-50",
        className,
      ].join(" ")}
    />
  );
}

export function GhostButton({
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium",
        "border bg-white hover:bg-gray-50",
        className,
      ].join(" ")}
    />
  );
}

export function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "w-full rounded-xl border px-3 py-2 text-sm outline-none",
        "focus:ring-4 focus:ring-gray-900/10",
        className,
      ].join(" ")}
    />
  );
}

export function Select({
  className = "",
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={[
        "w-full rounded-xl border px-3 py-2 text-sm outline-none",
        "focus:ring-4 focus:ring-gray-900/10",
        className,
      ].join(" ")}
    />
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700">
      {children}
    </span>
  );
}