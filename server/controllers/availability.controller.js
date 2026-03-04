import { availability, employees } from "../data/db.js";
import { v4 as uuid } from "uuid";

/**
 * GET /availability?employeeId=...
 * - If employeeId provided: return that employee's availability only
 * - Else: return all availability
 */
export function getAvailability(req, res) {
  const { employeeId } = req.query;

  if (employeeId) {
    const filtered = availability.filter((a) => a.employeeId === employeeId);
    return res.json({ data: filtered });
  }

  return res.json({ data: availability });
}

/**
 * POST /availability
 * Body:
 * { employeeId, day, start, end }
 * Example day: "Mon", "Tue", ...
 */
export function createAvailability(req, res) {
  const { employeeId, day, start, end } = req.body;

  if (!employeeId || !day || !start || !end) {
    return res.status(400).json({ error: "employeeId, day, start, end are required" });
  }

  // Ensure employee exists
  const empExists = employees.some((e) => e.id === employeeId);
  if (!empExists) {
    return res.status(404).json({ error: "Employee not found" });
  }

  // Simple time validation (works because "HH:MM" compares correctly)
  if (start >= end) {
    return res.status(400).json({ error: "start must be before end" });
  }

  const record = {
    id: uuid(),
    employeeId,
    day,
    start,
    end,
    createdAt: new Date().toISOString(),
  };

  availability.push(record);
  return res.status(201).json({ data: record });
}