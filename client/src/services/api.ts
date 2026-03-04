// client/src/services/api.ts
import axios from "axios";

const API_BASE = "http://localhost:5050";

export const api = axios.create({
  baseURL: API_BASE,
});

/**
 * EMPLOYEES
 */
export async function getEmployees() {
  const res = await api.get("/employees");
  return res.data.data;
}

export async function addEmployee(payload: { name: string; email: string; role: string }) {
  const res = await api.post("/employees", payload);
  return res.data.data;
}

/**
 * AVAILABILITY
 */
export async function getAvailability(employeeId?: string) {
  const res = await api.get("/availability", {
    params: employeeId ? { employeeId } : {},
  });
  return res.data.data;
}

export async function addAvailability(payload: {
  employeeId: string;
  day: string;
  start: string;
  end: string;
}) {
  const res = await api.post("/availability", payload);
  return res.data.data;
}

/**
 * SHIFTS
 */
export async function getShifts(employeeId?: string) {
  const res = await api.get("/shifts", {
    params: employeeId ? { employeeId } : {},
  });
  return res.data.data;
}

export async function addShift(payload: {
  employeeId: string;
  day: string;
  start: string;
  end: string;
}) {
  const res = await api.post("/shifts", payload);
  return res.data.data;
}

export async function deleteShift(id: string) {
  const res = await api.delete(`/shifts/${id}`);
  return res.data.data;
}