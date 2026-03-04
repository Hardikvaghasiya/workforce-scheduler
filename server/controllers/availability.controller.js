// server/controllers/availability.controller.js
import { v4 as uuid } from "uuid";
import { availability } from "../data/db.js"; // or whatever you named it

export function getAvailability(req, res) {
  const { employeeId } = req.query;

  const data = employeeId
    ? availability.filter((a) => a.employeeId === employeeId)
    : availability;

  res.json({ data });
}

export function createAvailability(req, res) {
  const { employeeId, day, start, end } = req.body;

  if (!employeeId || !day || !start || !end) {
    return res.status(400).json({ error: "employeeId, day, start, end are required" });
  }

  // ✅ DUPLICATE CHECK (must be inside this function)
  const duplicate = availability.some(
    (a) =>
      a.employeeId === employeeId &&
      a.day === day &&
      a.start === start &&
      a.end === end
  );

  if (duplicate) {
    return res.status(409).json({ error: "Availability already exists for this day and time" });
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