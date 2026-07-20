import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Imports routers
import authRouter from "./routes/auth";
import patientsRouter from "./routes/patients";
import medicationsRouter from "./routes/medications";
import medicinesRouter from "./routes/medicines";
import interactionsRouter from "./routes/interactions";
import alertsRouter from "./routes/alerts";
import feedbackRouter from "./routes/feedback";
import adminRouter from "./routes/admin";
import aiRouter from "./routes/ai";

// Database seeding helper
import { seedDatabase } from "./db/seeding";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/suraksha_setu";

// Middleware
app.use(cors());
app.use(express.json());

// Routes bindings
app.use("/api/auth", authRouter);
app.use("/api/patients", patientsRouter);
app.use("/api/medications", medicationsRouter);
app.use("/api/medicines", medicinesRouter);
app.use("/api/interactions", interactionsRouter);
app.use("/api/alerts", alertsRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/admin", adminRouter);
app.use("/api/ai", aiRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Suraksha Setu API is running" });
});

// Database Connection
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB successfully!");
    
    // Seed database if empty
    await seedDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
