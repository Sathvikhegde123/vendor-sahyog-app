// server/app.js
import express from "express";
import dotenv from "dotenv";
import dbConnect from "./config/dbConnect.js";

// route imports
import vendorRoutes from "./routes/vendorRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Connect DB
dbConnect();

// Routes
app.use("/api/vendors", vendorRoutes);

// Base route
app.get("/", (req, res) => {
  res.json({ message: "Vendor Sahyog Backend Running" });
});

export default app;
