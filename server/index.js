import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import employeesRoutes from "./routes/employees.routes.js";
import availabilityRoutes from "./routes/availability.routes.js";

dotenv.config();

const app = express();

app.use(cors());          // allow frontend calls (different port)
app.use(express.json()); // parse JSON request bodies
app.use("/availability", availabilityRoutes); 

app.get("/health", (req, res) => {
  res.json({ ok: true, message: "Server running" });
});

// Mount employees routes at /employees
app.use("/employees", employeesRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));