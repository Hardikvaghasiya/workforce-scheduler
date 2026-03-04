// server/routes/employees.routes.js
import { Router } from "express";
import { getEmployees, createEmployee } from "../controllers/employees.controller.js";

const router = Router();

/**
 * Route handler mapping:
 * GET  /employees  -> getEmployees()
 * POST /employees  -> createEmployee()
 */
router.get("/", getEmployees);
router.post("/", createEmployee);

export default router;