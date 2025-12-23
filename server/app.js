import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import dbConnect from "./config/dbConnect.js";

import vendorAuthRoutes from "./routes/vendorAuth.routes.js";
import employeeRoutes from "./routes/employee.routes.js";

import kriRoutes from "./routes/kri.routes.js";
import siteRiskRoutes from "./routes/siteRisk.routes.js";
import bcmPolicyRoutes from "./routes/bcmPolicy.routes.js";

import billingRoutes from "./routes/billing.routes.js";




console.log("GROQ KEY LOADED:", !!process.env.GROQ_API_KEY);





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



app.use("/api/kri", kriRoutes);
app.use("/api/site-risk", siteRiskRoutes);
app.use("/api/bcm-policy", bcmPolicyRoutes);
// existing middlewares...
app.use(express.json());

// billing
app.use("/api/billing", billingRoutes);

console.log("GROQ KEY LOADED:", !!process.env.GROQ_API_KEY);

app.get("/", (_, res) =>
  res.json({ message: "Vendor Sahyog Backend Running" })

);

export default app;
