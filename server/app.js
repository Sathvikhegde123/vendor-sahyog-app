// server/app.js
import express from "express";
import dotenv from "dotenv";
import dbConnect from "./config/dbConnect.js";
import cors from "cors";

// route imports
import vendorRoutes from "./routes/vendorRoutes.js";
import employeeRoutes from "./routes/employee.routes.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());


// Connect DB
dbConnect();

// Routes
app.use("/api/vendors", vendorRoutes);
app.use("/api/employees", employeeRoutes);

// Base route
app.get("/", (req, res) => {
  res.json({ message: "Vendor Sahyog Backend Running" });
});

export default app;
