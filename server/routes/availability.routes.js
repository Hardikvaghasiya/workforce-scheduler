import { Router } from "express";
import { getAvailability, createAvailability } from "../controllers/availability.controller.js";

const router = Router();

router.get("/", getAvailability);
router.post("/", createAvailability);

export default router;