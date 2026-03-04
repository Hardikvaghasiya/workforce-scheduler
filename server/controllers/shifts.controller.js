// server/controllers/shifts.controller.js
import { v4 as uuid } from "uuid";
import { shifts, availability, employees } from "../data/db.js";

/**
 * Helpers
 */
function timeToMinutes(t) {
  // "09:30" -> 570
  const [h, m] = String(t).split(":").map(Number);
  return h * 60 + m;
}

function overlaps(aStart, aEnd, bStart, bEnd) {
  // overlap if ranges intersect (not just touching)
  return aStart < bEnd && bStart < aEnd;
}

/**
 * GET /shifts
 * Returns all shifts (optionally filter by employeeId)
 */
export function getShifts(req, res) {
  const { employeeId } = req.query;

  const data = employeeId
    ? shifts.filter((s) => s.employeeId === employeeId)
    : shifts;

  return res.json({ data });
}

/**
 * POST /shifts
 * Body: { employeeId, day, start, end }
 *
 * Validation rules:
 * 1) start < end
 * 2) Shift must fit inside at least one availability block for that employee on that day
 * 3) No shift overlaps for the same employee on the same day
 */
export function createShift(req, res) {
  const { employeeId, day, start, end } = req.body;

  // Basic validation
  if (!employeeId || !day || !start || !end) {
    return res
      .status(400)
      .json({ error: "employeeId, day, start, end are required" });
  }

  const startMin = timeToMinutes(start);
  const endMin = timeToMinutes(end);

  if (startMin >= endMin) {
    return res.status(400).json({ error: "Start time must be before end time" });
  }

  // Ensure employee exists (optional but good)
  const empExists = employees.some((e) => e.id === employeeId);
  if (!empExists) {
    return res.status(404).json({ error: "Employee not found" });
  }

  // Check availability coverage:
  // Shift must fit inside ANY availability record for that day
  const availableBlock = availability.find((a) => {
    if (a.employeeId !== employeeId) return false;
    if (a.day !== day) return false;

    const aStart = timeToMinutes(a.start);
    const aEnd = timeToMinutes(a.end);

    // shift must be fully inside availability
    return startMin >= aStart && endMin <= aEnd;
  });

  if (!availableBlock) {
    return res.status(400).json({
      error: "Shift is outside employee availability for this day",
    });
  }

  // Check overlap with existing shifts for same employee + same day
  const conflict = shifts.find((s) => {
    if (s.employeeId !== employeeId) return false;
    if (s.day !== day) return false;

    const sStart = timeToMinutes(s.start);
    const sEnd = timeToMinutes(s.end);

    return overlaps(startMin, endMin, sStart, sEnd);
  });

  if (conflict) {
    return res.status(409).json({
      error: "Shift conflicts with an existing shift for this employee",
      conflict,
    });
  }

  const record = {
    id: uuid(),
    employeeId,
    day,
    start,
    end,
    createdAt: new Date().toISOString(),
  };

  shifts.push(record);

  return res.status(201).json({ data: record });
}

/**
 * DELETE /shifts/:id
 * Deletes shift by id
 */
export function deleteShift(req, res) {
  const { id } = req.params;

  const idx = shifts.findIndex((s) => s.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Shift not found" });
  }

  const removed = shifts.splice(idx, 1)[0];
  return res.json({ data: removed });
}