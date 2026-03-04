// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import employeesRoutes from "./routes/employees.routes.js";
import availabilityRoutes from "./routes/availability.routes.js";
import shiftsRoutes from "./routes/shifts.routes.js"; // ✅ add this

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true, message: "Server running" });
});

app.use("/employees", employeesRoutes);
app.use("/availability", availabilityRoutes);
app.use("/shifts", shiftsRoutes); // ✅ add this

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));