import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./config/dbConnect.js";

import vendorAuthRoutes from "./routes/vendorAuth.routes.js";
import employeeRoutes from "./routes/employee.routes.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.options("*", cors());
app.use(express.json());

dbConnect();

app.use("/api/auth/vendor", vendorAuthRoutes);
app.use("/api/employees", employeeRoutes);

app.get("/", (_, res) =>
  res.json({ message: "Vendor Sahyog Backend Running" })
);

export default app;
