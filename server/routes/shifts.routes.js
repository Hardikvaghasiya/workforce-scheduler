// server/routes/shifts.routes.js
import express from "express";
import { getShifts, createShift, deleteShift } from "../controllers/shifts.controller.js";

const router = express.Router();

// GET all shifts
router.get("/", getShifts);

// Create shift
router.post("/", createShift);

// Delete shift
router.delete("/:id", deleteShift);

export default router;