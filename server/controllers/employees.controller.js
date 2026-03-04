// server/controllers/employees.controller.js
import { employees } from "../data/db.js";
import { v4 as uuid } from "uuid";

/**
 * GET /employees
 * Returns all employees in memory.
 */
export function getEmployees(req, res) {
  res.json({ data: employees });
}

/**
 * POST /employees
 * Creates a new employee.
 * Body expected:
 * { name: string, email: string, role: "MANAGER" | "STAFF" }
 */
export function createEmployee(req, res) {
  const { name, email, role } = req.body;

  // Validate required fields
  if (!name || !email || !role) {
    return res.status(400).json({ error: "name, email, role are required" });
  }

  // Prevent duplicates by email
  const exists = employees.some(
    (e) => e.email.toLowerCase() === String(email).toLowerCase()
  );
  if (exists) {
    return res.status(409).json({ error: "Employee already exists" });
  }

  // Create employee object
  const newEmployee = {
    id: uuid(),
    name: String(name).trim(),
    email: String(email).trim(),
    role,
    createdAt: new Date().toISOString(),
  };

  employees.push(newEmployee);

  return res.status(201).json({ data: newEmployee });
}